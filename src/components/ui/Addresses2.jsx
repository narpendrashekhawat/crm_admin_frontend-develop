import { Box, Field, HStack, Input, InputGroup, Menu, Spinner, Text, VStack } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { useAppUserAuth, useAppUserProfile } from "../Context/axiosInstance";
import styles from "./Profile.module.css";
import { config } from "../Utils/Config";
import axios from "axios";
import { LuChevronDown } from "react-icons/lu";
// tried using loaders on state and city select lists but they increases(x3) api calls
 const Addresses = () => {
  const { isMobile } = useAppUserAuth();
  const { userProfileData, setUserProfileData } = useAppUserProfile();
  const isPrevDataSame = (
    // // !!flag -> this should work but doesnt ...and should i use this or is boolean 0 alright ?
    // (
    //   new Set( [
    //     ...Object.values( userProfileData.addresses.billingAdd ),
    //     ...Object.values( userProfileData.addresses.businessAdd ) ] )
    // ).size === Object.values( userProfileData.addresses.billingAdd ).length

    false
  );
  const { user } = useAppUserAuth();

  const [ clickedOnEntity, setClickedOnEntity ] = useState( {
    state: false,
    city: false
  } );
  const [ loadingStates, setLoadingStates ] = useState( {
    isStateLoading: true,
  } );
  const [ states, setStates ] = useState( [] );
  const [ cities, setCities ] = useState( [] );
  const [ selectedState, setSelectedState ] = useState( {
    id: 0,
    state: 'Select State',
  } );
  const [ selectedCity, setSelectedCity ] = useState( {
    id: 0,
    city: 'Select City',
    state_id: 0
  } );

  useEffect( () => {
    ; ( async () => {
      try {
        const response = await axios.get( `${ config.api.utility.get_states_and_cities }`, {
          headers: {
            'Authorization': `Bearer ${ user?.auth?.token }`
          }
        } );
        if ( response.status === 200 && response.data.success ) {
          setStates( response.data.data );
          setLoadingStates( ( prev ) => ( { ...prev, isStateLoading: false } ) );
        };
      } catch ( err ) {
        console.error( 'caught this error', err );
      }
    } )();
  }, [ user?.auth?.token ] );

  useEffect( () => {
    if ( states.length ) {
      setSelectedState( states.find( item => item.state.toLowerCase() == userProfileData?.addresses?.businessAdd?.State?.toLowerCase() ) );
    }
  }, [ states ] );

  useEffect( () => {
    if ( selectedState?.id ) {

      ; ( async () => {
        try {
          const response = await axios.get( `${ config.api.utility.get_cities_by_stateId }?stateId=${ selectedState.id }`, {
            headers: {
              'Authorization': `Bearer ${ user?.auth?.token }`
            }
          } );
          if ( response.status === 200 && response.data.success ) {
            setCities( response.data.data );
            setLoadingStates( ( prev ) => ( { ...prev, isCityLoading: false } ) );
          };
        } catch ( err ) {
          console.error( 'caught this error', err );
        }
      } )();
    }
  }, [ selectedState, user?.auth?.token ] );

  const [ isBillingSame, setIsBillingSame ] = useState( isPrevDataSame );

  const handleCheckboxChange = ( e ) => {
    const checked = e.target.checked;
    setIsBillingSame( checked );
    if ( checked ) {
      setUserProfileData( ( prev ) => ( {
        ...prev,
        addresses: {
          ...prev.addresses,
          billingAdd: { ...prev.addresses.businessAdd },
        },
      } ) );
    } else {
      setUserProfileData( ( prev ) => ( {
        ...prev,
        addresses: {
          ...prev.addresses,
          billingAdd: { ...prev.addresses.billingAdd },
        },
      } ) );
    }
  };



  const handleInput = ( e, field, addressType, evalue = null ) => {
    const value = evalue ?? e.target.value;

    if ( field.toLowerCase().includes( 'state' ) ) {
      setSelectedState( { ...states.find( item => item.state === value ) } );

      // Reset city when state changes
      setSelectedCity( {
        id: 0,
        city: 'Select City',
        state_id: 0
      } );

      // Clear city in userProfileData for both address types
      setUserProfileData( ( prev ) => ( {
        ...prev,
        addresses: {
          ...prev.addresses,
          [ addressType ]: {
            ...prev.addresses[ addressType ],
            [ field ]: value,
            city: 'Select City', // Reset city field
          },
          // If billing is same as business, also reset billing city when business state changes
          ...( addressType === 'businessAdd' && isBillingSame ? {
            billingAdd: {
              ...prev.addresses.billingAdd,
              State: value,
              city: 'Select City',
            }
          } : {} )
        },
      } ) );
      return;
    }

    if ( field.toLowerCase().includes( 'city' ) ) {
      setSelectedCity( { ...cities.find( item => item.city === value ) } );
    }

    setUserProfileData( ( prev ) => ( {
      ...prev,
      addresses: {
        ...prev.addresses,
        [ addressType ]: {
          ...prev.addresses[ addressType ],
          [ field ]: value,
        },
      },
    } ) );
  };

  useEffect( () => {
    if ( isBillingSame ) {
      setUserProfileData( ( prev ) => ( {
        ...prev,
        addresses: {
          ...prev.addresses,
          billingAdd: { ...prev.addresses.businessAdd },
        },
      } ) );
    }
  }, [ isBillingSame, setUserProfileData ] );

  return (
    <VStack align={ 'start' } w={ '100%' }>
      <VStack className={ styles.main } >
        <VStack className={ styles.mainContentHeadingWrapper } >
          <Text className={ styles.mainContentHeading }>Business Address</Text>
          <Text className={ styles.mainContentDescription }>Registered Address</Text>
        </VStack>

        <HStack className={ styles.generalDetailsForm }>
          { !isMobile && <VStack align={ 'start' } className={ styles.generalDetailsFormFirstHalf }>
            <Box pos={ 'relative' } mt={ '1rem' }>
              <Box w={ '95px' } />
              <Box cursor={ 'pointer' } scale={ 0.75 } pos={ 'absolute' } left={ 0 } transform={ 'translate(125%,0)' } bottom={ '-0.65rem' } />
            </Box>
          </VStack> }

          <VStack align={ 'start' } w={ '100%' }>
            <HStack align={ 'start' } className={ styles.generalDetailsFormSecondHalf }>
              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' }>
                <Field.Label className={ styles.inputFieldLabel }>
                  Name <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    type={ 'text' }
                    value={ userProfileData.addresses.businessAdd.name || "" }
                    onChange={ ( e ) => handleInput( e, 'name', 'businessAdd' ) }
                    autoComplete={ 'name' }
                    className={ styles.inputField }
                    placeholder={ 'Name' } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' }>
                <Field.Label className={ styles.inputFieldLabel }>
                  Contact Number <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    type={ 'number' }
                    value={ userProfileData.addresses.businessAdd.mobile || "" }
                    onChange={ ( e ) => handleInput( e, 'mobile', 'businessAdd' ) }
                    autoComplete={ 'mobile' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Number' } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label className={ styles.inputFieldLabel }>
                  Email Id <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    type={ 'email' }
                    value={ userProfileData.addresses.businessAdd.email || "" }
                    onChange={ ( e ) => handleInput( e, 'email', 'businessAdd' ) }
                    autoComplete={ 'email' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Email' } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' }>
                <Field.Label className={ styles.inputFieldLabel }>
                  Website Address <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    type={ 'url' }
                    value={ userProfileData.addresses.businessAdd.webURL || "" }
                    onChange={ ( e ) => handleInput( e, 'webURL', 'businessAdd' ) }
                    autoComplete={ 'url' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Website URL' } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label className={ styles.inputFieldLabel }>
                  Address Line 1 <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    type={ 'text' }
                    value={ userProfileData.addresses.businessAdd.addLine1 || "" }
                    onChange={ ( e ) => handleInput( e, 'addLine1', 'businessAdd' ) }
                    autoComplete={ 'off' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Address' } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' }>
                <Field.Label className={ styles.inputFieldLabel }>
                  Address Line 2 <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    type={ 'text' }
                    value={ userProfileData.addresses.businessAdd.addLine2 || "" }
                    onChange={ ( e ) => handleInput( e, 'addLine2', 'businessAdd' ) }
                    autoComplete={ 'off' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Address' } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label className={ styles.inputFieldLabel }>
                  Pincode <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    value={ userProfileData.addresses.businessAdd.pinCode || "" }
                    onChange={ ( e ) => handleInput( e, 'pinCode', 'businessAdd' ) }
                    type={ 'number' }
                    autoComplete={ 'postal-code' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Pincode' } />
                </InputGroup>
              </Field.Root>

              <Field.Root onClick={ ( e ) => {
                e.stopPropagation();
                e.preventDefault();
                setClickedOnEntity( ( prev ) => ( { ...prev, state: !prev.state } ) );
              } } className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label onClick={ ( e ) => e.stopPropagation() } pointerEvents={ 'none' } className={ styles.inputFieldLabel }>
                  Select State <Field.RequiredIndicator />
                </Field.Label>

                <Box w={ '100%' } onClick={ ( e ) => e.stopPropagation() } pos={ 'absolute' } bottom={ 0 } left={ 0 } zIndex={ 1 } >
                  <Menu.Root >
                    <Menu.Trigger asChild>
                      <HStack justifyContent={ 'space-between' } fontSize={ '14px' } h={ '100%' } p={ '8.5px' } _focus={ { bg: 'bg.muted' } } borderRadius='12px' w='100%' border={ '1px solid transparent' } cursor={ 'pointer' }>
                        { userProfileData.addresses.businessAdd.State }<LuChevronDown />
                      </HStack>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content pos={ 'relative' } maxH={ '280px' } minH={ '280px' } minW={ '225px' } marginBlock={ '10px' } >
                        <Menu.RadioItemGroup
                          value={ selectedState?.state?.toLowerCase()?.includes( 'state' ) ? 'Select State' : userProfileData.addresses.businessAdd.State }
                          onValueChange={ ( e ) => {
                            handleInput( e, 'State', 'businessAdd', e.value );
                          } }
                        >
                          <VStack h={ '100%' } align={ 'center' } justifyContent={ 'center' }>
                            { loadingStates.isStateLoading
                              ? <Box pos={ 'absolute' } top={ '50%' } left={ '50%' } transform={ 'translate(-50%,-50%)' }>
                                <Spinner size="xl" />
                              </Box>
                              :
                              states.map( ( item ) => (
                                <Menu.RadioItem key={ item.id } value={ `${ item.state }` }>
                                  <HStack>
                                    <Text >{ item.state }</Text>
                                  </HStack>
                                  <Menu.ItemIndicator />
                                </Menu.RadioItem>
                              ) ) }
                          </VStack>
                        </Menu.RadioItemGroup>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Box>

                <Input readOnly tabIndex={ -1 }
                  zIndex={ 0 } name="addressLabel1" pointerEvents={ 'none' } autoComplete={ 'off' } className={ styles.inputField } color={ 'transparent !important' } placeholder={ '' } />
              </Field.Root>

              <Field.Root onClick={ ( e ) => {
                setClickedOnEntity( ( prev ) => ( { ...prev, city: !prev.city } ) );
                e.stopPropagation();
                e.preventDefault();
              }
              } className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label className={ styles.inputFieldLabel }>
                  Select City <Field.RequiredIndicator />
                </Field.Label>

                <Box w={ '100%' } pos={ 'absolute' } bottom={ 0 } left={ 0 } zIndex={ 1 } >
                  <Menu.Root >
                    <Menu.Trigger asChild>
                      <HStack justifyContent={ 'space-between' } fontSize={ '14px' } h={ '100%' } p={ '8.5px' } _focus={ { bg: 'bg.muted' } } borderRadius='12px' w='100%' border={ '1px solid transparent' } cursor={ 'pointer' }>
                        { userProfileData.addresses.businessAdd.city }<LuChevronDown />
                      </HStack>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content maxH={ '280px' } minW={ '225px' } marginBlock={ '10px' } >
                        <Menu.RadioItemGroup
                          value={ userProfileData?.addresses?.businessAdd?.city?.length > 1 ? userProfileData.addresses.businessAdd.city : 'Select City' }
                          onValueChange={ ( e ) => {
                            handleInput( e, 'city', 'businessAdd', e.value );
                          } }
                        >
                          { loadingStates.isCityLoading
                            ? <Box pos={ 'absolute' } top={ '50%' } left={ '50%' } transform={ 'translate(-50%,-50%)' }>
                              <Spinner size="xl" />
                            </Box>
                            :
                            cities.length ?
                              cities.map( ( item ) => (
                                <Menu.RadioItem key={ item.id } value={ `${ item.city }` }>
                                  <HStack>
                                    <Text >{ item.city }</Text>
                                  </HStack>
                                  <Menu.ItemIndicator />
                                </Menu.RadioItem>
                              ) )
                              :
                              <Menu.RadioItem value={ '' }>
                                <HStack>
                                  <Text >Select a state to see its cities</Text>
                                </HStack>
                                <Menu.ItemIndicator />
                              </Menu.RadioItem>
                          }
                        </Menu.RadioItemGroup>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Box>
                <Input tabIndex={ -1 }
                  zIndex={ 0 } name="addressLabel2" pointerEvents={ 'none' } autoComplete={ 'off' } className={ styles.inputField } paddingLeft={ '2rem' } placeholder={ '' } />
              </Field.Root>
            </HStack>
          </VStack>
        </HStack>
      </VStack>

      <VStack className={ styles.main }  >
        <VStack className={ styles.mainContentHeadingWrapper }>
          <HStack>
            <Text className={ styles.mainContentHeading }>Billing Address</Text>
            <input
              type="checkbox"
              checked={ isBillingSame }
              onChange={ handleCheckboxChange }
              name="billing-same-as-billing"
            />
          </HStack>
          <Text className={ styles.mainContentDescription }>If same as above, select the check box</Text>
        </VStack>

        <HStack className={ styles.generalDetailsForm }>
          { !isMobile && <VStack align={ 'start' } className={ styles.generalDetailsFormFirstHalf }>
            <Box pos={ 'relative' } mt={ '1rem' }>
              <Box w={ '95px' } />
              <Box cursor={ 'pointer' } scale={ 0.75 } pos={ 'absolute' } left={ 0 } transform={ 'translate(125%,0)' } bottom={ '-0.65rem' } />
            </Box>
          </VStack> }

          <VStack align={ 'start' } w={ '100%' }>
            <HStack align={ 'start' } className={ styles.generalDetailsFormSecondHalf }>
              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' }>
                <Field.Label className={ styles.inputFieldLabel }>
                  Name <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    value={ userProfileData.addresses.billingAdd.name || "" }
                    type={ 'text' }
                    onChange={ ( e ) => handleInput( e, 'name', 'billingAdd' ) }
                    autoComplete={ 'name' }
                    className={ styles.inputField }
                    placeholder={ 'Name' }
                    disabled={ isBillingSame } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' }>
                <Field.Label className={ styles.inputFieldLabel }>
                  Contact Number <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    value={ userProfileData.addresses.billingAdd.mobile || "" }
                    onChange={ ( e ) => handleInput( e, 'mobile', 'billingAdd' ) }
                    type={ 'number' }
                    autoComplete={ 'mobile' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Number' }
                    disabled={ isBillingSame } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label className={ styles.inputFieldLabel }>
                  Email Id <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    value={ userProfileData.addresses.billingAdd.email || "" }
                    onChange={ ( e ) => handleInput( e, 'email', 'billingAdd' ) }
                    type={ 'email' }
                    autoComplete={ 'email' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Email' }
                    disabled={ isBillingSame } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' }>
                <Field.Label className={ styles.inputFieldLabel }>
                  Website Address <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    value={ userProfileData.addresses.billingAdd.webURL || "" }
                    onChange={ ( e ) => handleInput( e, 'webURL', 'billingAdd' ) }
                    type={ 'url' }
                    autoComplete={ 'url' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Website URL' }
                    disabled={ isBillingSame } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label className={ styles.inputFieldLabel }>
                  Address Line 1 <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    value={ userProfileData.addresses.billingAdd.addLine1 || "" }
                    onChange={ ( e ) => handleInput( e, 'addLine1', 'billingAdd' ) }
                    type={ 'text' }
                    autoComplete={ 'off' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Address' }
                    disabled={ isBillingSame } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' }>
                <Field.Label className={ styles.inputFieldLabel }>
                  Address Line 2 <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    value={ userProfileData.addresses.billingAdd.addLine2 || "" }
                    onChange={ ( e ) => handleInput( e, 'addLine2', 'billingAdd' ) }
                    type={ 'text' }
                    autoComplete={ 'off' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Address' }
                    disabled={ isBillingSame } />
                </InputGroup>
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label className={ styles.inputFieldLabel }>
                  Pincode <Field.RequiredIndicator />
                </Field.Label>
                <InputGroup>
                  <Input
                    value={ userProfileData.addresses.billingAdd.pinCode || "" }
                    onChange={ ( e ) => {
                      handleInput( e, 'pinCode', 'billingAdd' );
                    } }
                    type={ 'number' }
                    autoComplete={ 'postal-code' }
                    className={ styles.inputField }
                    placeholder={ 'Enter Pincode' }
                    disabled={ isBillingSame } />
                </InputGroup>
              </Field.Root>

              <Field.Root
                onClick={ ( e ) => {
                  setClickedOnEntity( ( prev ) => ( { ...prev, state: true } ) );
                  e.stopPropagation();
                  e.preventDefault();
                } }
                className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label className={ styles.inputFieldLabel }>
                  Select State <Field.RequiredIndicator />
                </Field.Label>

                <Box disabled={ isBillingSame } opacity={ isBillingSame ? 0.5 : 1 } w={ '100%' } pos={ 'absolute' } bottom={ 0 } left={ 0 } zIndex={ 1 } >
                  <Menu.Root >
                    <Menu.Trigger disabled={ isBillingSame } asChild>
                      <HStack justifyContent={ 'space-between' } fontSize={ '14px' } h={ '100%' } p={ '8.5px' } _focus={ { bg: 'bg.muted' } } borderRadius='12px' w='100%' border={ '1px solid transparent' } cursor={ 'pointer' }>
                        { userProfileData.addresses.billingAdd.State }<LuChevronDown />
                      </HStack>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content maxH={ '280px' } minH={ '280px' } minW={ '225px' } marginBlock={ '10px' } >
                        <Menu.RadioItemGroup
                          value={ selectedState?.state?.toLowerCase()?.includes( 'state' ) ? 'Select State' : userProfileData.addresses.billingAdd.State }
                          onValueChange={ ( e ) => {
                            handleInput( e, 'State', 'billingAdd', e.value );
                          } }
                        >

                          { loadingStates.isStateLoading
                            ? <Box pos={ 'absolute' } top={ '50%' } left={ '50%' } transform={ 'translate(-50%,-50%)' }>
                              <Spinner size="xl" />
                            </Box>
                            :
                            states.map( ( item ) => (
                              <Menu.RadioItem key={ item.id } value={ `${ item.state }` }>
                                <HStack>
                                  <Text >{ item.state }</Text>
                                </HStack>
                                <Menu.ItemIndicator />
                              </Menu.RadioItem>
                            ) ) }
                        </Menu.RadioItemGroup>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Box>
                <Input tabIndex={ -1 }
                  zIndex={ 0 } name="addressLabel3" pointerEvents={ 'none' } autoComplete={ 'off' } className={ styles.inputField } placeholder={ '' } />
              </Field.Root>

              <Field.Root className={ styles.inputFieldWrapper } minW={ '100% !important' } required>
                <Field.Label onClick={ ( e ) => {
                  e.stopPropagation();
                  e.preventDefault();
                } } className={ styles.inputFieldLabel }>
                  Select City <Field.RequiredIndicator />
                </Field.Label>

                <Box w={ '100%' } disabled={ isBillingSame } opacity={ isBillingSame ? 0.5 : 1 } pos={ 'absolute' } bottom={ 0 } left={ 0 } zIndex={ 1 } >
                  <Menu.Root >
                    <Menu.Trigger disabled={ isBillingSame } asChild>
                      <HStack justifyContent={ 'space-between' } fontSize={ '14px' } h={ '100%' } p={ '8.5px' } _focus={ { bg: 'bg.muted' } } borderRadius='12px' w='100%' border={ '1px solid transparent' } cursor={ 'pointer' }>
                        { userProfileData.addresses.billingAdd.city?.length > 1 ? userProfileData.addresses.billingAdd.city : "Select City" }<LuChevronDown />
                      </HStack>
                    </Menu.Trigger>
                    <Menu.Positioner>
                      <Menu.Content zIndex={ 'auto' } maxH={ '280px' } marginBlock={ '10px' } >
                        <Menu.RadioItemGroup
                          value={ userProfileData?.addresses?.billingAdd?.city?.length > 0 ? userProfileData.addresses.billingAdd.city : 'Select City' }
                          onValueChange={ ( e ) => {
                            handleInput( e, 'city', 'billingAdd', e.value );
                          } }
                        >
                          { cities.length
                            ? cities.map( ( item ) => (
                              <Menu.RadioItem key={ item.id } value={ `${ item.city }` }>
                                <HStack>
                                  <Text >{ item.city }</Text>
                                </HStack>
                                <Menu.ItemIndicator />
                              </Menu.RadioItem>
                            ) )
                            :
                            <Menu.RadioItem value={ '' }>
                              <HStack>
                                <Text >Select a state to see its cities</Text>
                              </HStack>
                              <Menu.ItemIndicator />
                            </Menu.RadioItem>
                          }
                        </Menu.RadioItemGroup>
                      </Menu.Content>
                    </Menu.Positioner>
                  </Menu.Root>
                </Box>
                <Input disabled={ isBillingSame } tabIndex={ -1 }
                  zIndex={ 0 } name="addressLabel5" pointerEvents={ 'none' } autoComplete={ 'off' } className={ styles.inputField } paddingLeft={ '2rem' } placeholder={ '' } />
              </Field.Root>
            </HStack>
          </VStack>
        </HStack>
      </VStack>
    </VStack>
  );
};
export default Addresses;