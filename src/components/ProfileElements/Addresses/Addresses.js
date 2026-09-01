import React, { useState, useEffect } from 'react';
import { Input, HStack, Text, VStack, Checkbox, Box, Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import axios from "axios";
import { Config } from "../../Utils/Config";

const Addresses = ({ businessAddress: initBusinessAddress = {}, billingAddress: initBillingAddress = {} ,isBillingSame, setIsBillingSame, setBusinessAddress, setBillingAddress, businessAddress, billingAddress} ) => {
    const InputStyle = {
        padding: "12px 15px",
        _placeholder: { color: "#bebcbcff" },
        color: "black",
        borderRadius: "12px",
        width: "100%",
        height: "48px",
        boxShadow: "0px 1px 2px rgba(0,0,0,5%)",
        border: "1px solid #bfc0c540",
        iconcolor: "#8B8D97"
    };

    console.log(businessAddress,'000000000000000000000000000')
    const [states, setStates] = useState([]);
   const [ cities, setCities ] = useState( [] );
   const [selectedBusinessState, setSelectedBusinessState] = useState({ id: 0, state: "" });
const [selectedBillingState, setSelectedBillingState] = useState({ id: 0, state: "" });


    console.log(`states, "iiiiiiiu"`)
    const [businessCities, setBusinessCities] = useState([]);
    const [billingCities, setBillingCities] = useState([]);

    // const [isBillingSame, setIsBillingSame] = useState(false);
//    const [businessAddress, setBusinessAddress] = useState(initBusinessAddress || {});
// const [billingAddress, setBillingAddress] = useState(initBillingAddress || {});

console.log(initBillingAddress, "IIIIII")
console.log(initBusinessAddress, "IIIIII")
    const billingTextColor = isBillingSame ? "#8C8C91" : "#0B0C14";

     useEffect(() => {
  const ids = states.map(state => state.id);
  console.log("IDs:", ids);
}, [states]);


     const [ selectedState, setSelectedState ] = useState( {
    id:0,
    state: 'Select State',
  } );

    useEffect(() => {
        const fetchStates = async () => {
            try {
                const token = localStorage.getItem("authToken");
                if (!token) return;

                const res = await axios.get(`${Config.states}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const statesList = res.data?.data || [];
                setStates(statesList);
                initBusinessAddress?.onStatesFetched?.(statesList);
            } catch (error) {
                console.error("Error fetching states:", error.response?.data || error.message);
            }
        };
        fetchStates();
    }, []);

    const fetchCities = async (addressType, stateId) => {
  if (!stateId) return;

  try {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const res = await axios.get(`${Config.states}?stateId=${stateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const cityList = res.data?.data || [];

    if (addressType === "business") {
      setBusinessCities(cityList);
    } else if (addressType === "billing") {
      setBillingCities(cityList);
    }
  } catch (error) {
    console.error(`Error fetching ${addressType} cities:`, error.response?.data || error.message);
  }
};


    // Effect to handle city fetching for business address when its state changes
   useEffect(() => {
    if (selectedState.id) {
        fetchCities("business");
        setBusinessAddress(prev => ({ ...prev, city: "" }));
    }
}, [businessAddress.state, selectedState.id]);

    // Effect to handle city fetching for billing address when its state changes (only if not "same as above")
   useEffect(() => {
  if (selectedBusinessState.id) {
    fetchCities("business", selectedBusinessState.id);
    setBusinessAddress(prev => ({ ...prev, city: "" }));
  }
}, [selectedBusinessState.id]);

    // Single handler for all address field changes
    const handleAddressChange = (addressType, field, value) => {
  let updatedAddress;

  if (addressType === "business") {
    updatedAddress = { ...businessAddress, [field]: value, addressType: "Business" };
    setBusinessAddress(updatedAddress);
    initBusinessAddress?.onBusinessChange?.(field, value, updatedAddress);

  } else if (addressType === "billing") {
    updatedAddress = { ...billingAddress, [field]: value, addressType: "Billing" }; 
    setBillingAddress(updatedAddress);
    initBusinessAddress?.onBillingChange?.(field, value, updatedAddress);
  }
};


// Sync billing with business only if checkbox is checked
useEffect(() => {
  if (isBillingSame) {
    const syncedAddress = {
      ...businessAddress,
      addressType: "Billing",
    };
    setBillingAddress(syncedAddress);
    setBillingCities([...businessCities]);
  }
}, [isBillingSame, businessAddress, businessCities]);







// Handle billing state change when checkbox is NOT checked
useEffect(() => {
  if (!isBillingSame && selectedBillingState.id) {
    fetchCities("billing", selectedBillingState.id);
    setBillingAddress(prev => ({
      ...prev,
      city: ""
    }));
  }
}, [selectedBillingState.id, isBillingSame]);





    return (
        <VStack align={"start"}>
            {/* Business Address Section */}
            <HStack height={"445px"} align={"start"}>
                <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                    <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                    <Box width="1px" height="full" backgroundColor="#DCDCDE" />
                </VStack>
                <VStack id='business-address' align="start" w="full" mt="2rem">
                    <VStack align="start" gap={0} mb="1rem">
                        <Text fontSize="18px" color="#0B0C14">Business Address</Text>
                        <Text fontSize="16px" color="#8C8C91">Registered Address</Text>
                    </VStack>

                    <HStack ml="9.5rem">
                        <VStack flexWrap="wrap" gap="1.25rem" align="start">
                            <HStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Contact Person Name<sup>*</sup></Text>
                                    <Input sx={InputStyle} type='text' value={businessAddress.name || initBusinessAddress.name || ""} onChange={(e) => handleAddressChange("business", "name", e.target.value)} />
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Contact Person No.<sup>*</sup></Text>
                                    <Input sx={InputStyle} type='number' value={businessAddress.mobile || initBusinessAddress.mobile  || ""} onChange={(e) => handleAddressChange("business", "mobile", e.target.value)} />
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Email Id<sup>*</sup></Text>
                                    <Input sx={InputStyle} type='email'  value={businessAddress.email || initBusinessAddress.email || ""} onChange={(e) => handleAddressChange("business", "email", e.target.value)} />
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Website Address</Text>
                                    <Input sx={InputStyle} value={businessAddress.webURL || initBusinessAddress.webURL || ""} onChange={(e) => handleAddressChange("business", "webURL", e.target.value)} />
                                </VStack>
                            </HStack>
                            <HStack width="100%">
                                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Address Line 1 <sup>*</sup></Text>
                                    <Input sx={InputStyle} value={businessAddress.addLine1 || initBusinessAddress.addLine1  || ""} onChange={(e) => handleAddressChange("business", "addLine1", e.target.value)} />
                                </VStack>
                                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Address Line 2</Text>
                                    <Input sx={InputStyle} value={businessAddress.addLine2 || initBusinessAddress.addLine2  || ""} onChange={(e) => handleAddressChange("business", "addLine2", e.target.value)} />
                                </VStack>
                            </HStack>
                            <HStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Select State<sup>*</sup></Text>
                                    <Menu>
                                        <MenuButton as={Button} h="50px" w="100%" textAlign="left" rightIcon={<ChevronDownIcon />} sx={InputStyle} bg="#fff" fontWeight="400">
                                            {businessAddress.state || initBusinessAddress.state || "Select State"}
                                        </MenuButton>
                                        <MenuList maxH="200px" overflowY="auto">
                                            {states.map(st => (
                                                <MenuItem key={st.id}  value={ `${ st.state }`}  onClick={() => {
                                                    handleAddressChange("business", "state", st.state);
                                                    setSelectedBusinessState({ id: st.id, state: st.state });
                                                    fetchCities("business", st.id);   
                                                  }} >{st.state}</MenuItem>
                                            ))}
                                        </MenuList>
                                    </Menu>
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Select City<sup>*</sup></Text>
                                    <Menu>
                                        <MenuButton as={Button} h="50px" w="100%" textAlign="left" rightIcon={<ChevronDownIcon />} sx={InputStyle} bg="#fff" fontWeight="400">
                                            {businessAddress.city || initBusinessAddress.city || "Select City"}
                                        </MenuButton>
                                        <MenuList maxH="200px" overflowY="auto">
                                           {businessCities.map((ct) => (
                                                 <MenuItem key={ct.id} onClick={() => handleAddressChange("business", "city", ct.city)}>
                                                     {ct.city}
                                                 </MenuItem>
                                             ))}
                                        </MenuList>
                                    </Menu>
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">PinCode<sup>*</sup></Text>
                                    <Input sx={InputStyle} type='number' value={businessAddress.pinCode || initBusinessAddress.pinCode  || ""} onChange={(e) => handleAddressChange("business", "pinCode", e.target.value)} />
                                </VStack>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
            </HStack>

            {/* Billing Address Section */}
            <HStack height={"445px"} align={"start"}>
                <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                    <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                    <Box width="1px" height="full" backgroundColor="#DCDCDE" />
                </VStack>
                <VStack id='billing-address' align="start" w="full" mt="2rem">
                    <VStack align="start" gap={0} mb="1rem">
                        <Text fontSize="18px" color={billingTextColor}>Billing Address</Text>
                        <HStack>
                            <Text fontSize="16px" color={billingTextColor}>If same as above, select the check box</Text>
                            <Checkbox isChecked={isBillingSame} onChange={(e) => setIsBillingSame(e.target.checked)} />
                        </HStack>
                    </VStack>

                    <HStack ml="9.5rem">
                        <VStack flexWrap="wrap" gap="1.25rem" align="start">
                            <HStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Contact Person Name<sup>*</sup></Text>
                                    <Input sx={InputStyle} type='text' value={billingAddress.name  || ""} onChange={(e) => handleAddressChange("billing", "name", e.target.value)} isDisabled={isBillingSame} />
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Contact Person No.<sup>*</sup></Text>
                                    <Input sx={InputStyle} type='number' value={billingAddress.mobile  || ""} onChange={(e) => handleAddressChange("billing", "mobile", e.target.value)} isDisabled={isBillingSame} />
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Email Id<sup>*</sup></Text>
                                    <Input sx={InputStyle} type='email' value={billingAddress.email || ""} onChange={(e) => handleAddressChange("billing", "email", e.target.value)} isDisabled={isBillingSame} />
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Website Address</Text>
                                    <Input sx={InputStyle} value={billingAddress.webURL || ""} onChange={(e) => handleAddressChange("billing", "webURL", e.target.value)} isDisabled={isBillingSame} />
                                </VStack>
                            </HStack>
                            <HStack width="100%">
                                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Address Line 1 <sup>*</sup></Text>
                                    <Input sx={InputStyle} value={billingAddress.addLine1 || ""} onChange={(e) => handleAddressChange("billing", "addLine1", e.target.value)} isDisabled={isBillingSame} />
                                </VStack>
                                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Address Line 2</Text>
                                    <Input sx={InputStyle} value={billingAddress.addLine2 || ""} onChange={(e) => handleAddressChange("billing", "addLine2", e.target.value)} isDisabled={isBillingSame} />
                                </VStack>
                            </HStack>
                            <HStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Select State<sup>*</sup></Text>
                                    <Menu>
                                        <MenuButton as={Button} h="50px" w="100%" textAlign="left" rightIcon={<ChevronDownIcon />} sx={InputStyle} bg="#fff" fontWeight="400" isDisabled={isBillingSame}>
                                            {billingAddress.state || "Select State"}
                                        </MenuButton>
                                        <MenuList maxH="200px" overflowY="auto">
                                            {states.map(st => (
                                                <MenuItem key={st.id} onClick={() => {
                                                 handleAddressChange("billing", "state", st.state);
                                                 setSelectedBillingState({ id: st.id, state: st.state });
                                                 fetchCities("billing", st.id);   
                                               }}>{st.state}</MenuItem>
                                            ))}
                                        </MenuList>
                                    </Menu>
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Select City<sup>*</sup></Text>
                                    <Menu>
                                        <MenuButton as={Button} h="50px" w="100%" textAlign="left" rightIcon={<ChevronDownIcon />} sx={InputStyle} bg="#fff" fontWeight="400" isDisabled={isBillingSame}>
                                           {billingAddress.city || "Select City"}
                                        </MenuButton>
                                        <MenuList maxH="200px" overflowY="auto">
                                          {billingCities.map((ct) => (
                                         <MenuItem key={ct.id} onClick={() => handleAddressChange("billing", "city", ct.city)}>
                                             {ct.city}
                                         </MenuItem>
                                     ))}

                                        </MenuList>
                                    </Menu>
                                </VStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>PinCode<sup>*</sup></Text>
                                    <Input sx={InputStyle} type='number' value={billingAddress.pinCode || ""} onChange={(e) => handleAddressChange("billing", "pinCode", e.target.value)} isDisabled={isBillingSame} />
                                </VStack>
                            </HStack>
                        </VStack>
                    </HStack>   
                </VStack>
            </HStack>
        </VStack>
    );
};

export default Addresses;


