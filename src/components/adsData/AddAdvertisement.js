import React, { useState, useRef, useEffect } from "react";
import {
  Box, Input, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  Select, Text, Flex, HStack, VStack, useToast,
  FormControl, FormLabel, Heading, Switch, Spinner, Textarea,
} from "@chakra-ui/react";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../Header/HeaderBar";
import { GoHomeFill } from "react-icons/go";
import Footer from "../footer";
import { IoIosArrowDown } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Config } from "../Utils/Config";

const AddAdvertisement = () => {
  const InputStl = {
    fontSize: "14px",
    color: "#333333",
    border: "1px solid",
    width: "300px",
    height: "48px",
    borderRadius: "none",
  };

  const [googleScript, setGoogleScript] = useState("");
  const [adName, setAdName] = useState("");
  const [amount, setAmount] = useState(0);
  const [clientName, setClientName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [locations, setLocations] = useState();
  const [contentText, setContentText] = useState("");
  const [contentImg, setContentImg] = useState(null);
  const [browser, setBrowser] = useState("");
  const [status, setStatus] = useState("inactive");
  const [saving, setSaving] = useState(false);
  const [locationsData, setLocationsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adType, setAdType] = useState('');
  const [categoryType, setCategoryType] = useState("");  
  const [categoryOptions, setCategoryOptions] = useState([]); 
  const [selectedCategoryItem, setSelectedCategoryItem] = useState(""); 
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [statesData, setStatesData] = useState([]);   
  const [citiesData, setCitiesData] = useState([]);   
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [targetUrl, setTargetUrl] = useState("");




  const fileInputRef = useRef(null);

  const handleBrowseClick = () => {
    fileInputRef.current.click();
  };

  const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    setContentImg(file);  
    setBrowser(file);       
  }
};


  const toast = useToast();
  const navigate = useNavigate();

  const handleLocationChange = (e) => {
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    setLocations(value);
  };

  useEffect(() => {
  const fetchStates = async () => {
    setLoadingStates(true);
    try {
      const res = await axios.get(`${Config?.states}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(res.data, "sapoapsoapo");
      
      setStatesData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching states:", err);
    } finally {
      setLoadingStates(false);
    }
  };
  fetchStates();
}, []);


useEffect(() => {
  const fetchCities = async () => {
    if (!state) return; 
    setLoadingCities(true);
    try {
      const res = await axios.get(`${Config?.states}?stateId=${state}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(res.data.data, "ertyuio");
      
      setCitiesData(res.data.data || []);
    } catch (err) {
      console.error("Error fetching cities:", err);
    } finally {
      setLoadingCities(false);
    }
  };
  fetchCities();
}, [state]);




  useEffect(() => {
  const fetchCategoryData = async () => {
    if (!categoryType) return;
    setLoadingCategory(true);
    try {
      const res = await axios.get(`${Config?.ad_modules_url}?category=${categoryType}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      console.log(res.data, "vvcvcnbnbvncvb");
      
      
      setCategoryOptions(res.data.apiData || []);
    } catch (err) {
      console.error("Error fetching category data:", err);
    } finally {
      setLoadingCategory(false);
    }
  };
  fetchCategoryData();
}, [categoryType]);


   useEffect(() => {
    const fetchLocations = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${Config?.Locations_url}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        console.log(res.data, "dfdfdffdffdfdfdfd")
        
        setLocationsData(res.data.apiData || []);
      } catch (err) {
        console.error("Error fetching locations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocations();
  }, []);
  // const handleImageChange = (e) => {
  //   if (e.target.files[0]) {
  //     setContentImg(e.target.files[0]);
  //   }
  // };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const isGoogleOnly = googleScript.trim() !== "";
  const isOtherFieldsFilled =
    adName.trim() &&
    clientName.trim() &&
    fromDate.trim() &&
    toDate.trim() &&
    state.trim() &&
    city.trim() &&
    categoryType.trim() &&
    selectedCategoryItem.trim() &&
    amount > 0 &&
    locations && locations.length > 0 &&
    contentText.trim() &&
    contentImg &&    
    status !== null;

  // Validation
  if (isGoogleOnly && !isOtherFieldsFilled) {
    // Only Google Script is allowed
  } else if (!isGoogleOnly && !isOtherFieldsFilled) {
    toast({
      title: "Missing Fields",
      description: "Please fill ALL required advertisement details.",
      status: "warning",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
    return;
  } else if (!(isGoogleOnly || isOtherFieldsFilled)) {
    toast({
      title: "Missing Fields",
      description: "Please fill either Google Script OR all advertisement details.",
      status: "warning",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
    return;
  }

  setSaving(true);

  try {
    let imageUrl = "";

    //  Upload image if manual ad
    if (!isGoogleOnly && contentImg) {
      const formData = new FormData();
      formData.append("file", contentImg); // key depends on API
      const uploadRes = await axios.post(`${Config?.imageUpdate_url}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });
       console.log("Image Upload Response:", uploadRes.data.apiData[0].url);
      //  Assuming API response:
      // { imgurl: "...", target_url: "..." }
      const uploadedFile = uploadRes.data?.apiData?.[0];
      imageUrl = uploadedFile?.url || "";

      if (!imageUrl) {
        throw new Error("Image upload failed: No image URL returned");
      }
    }

    //  Prepare payload
    const payload = isGoogleOnly
      ? {
          google_ad_code: googleScript,
          adType: adType,
        }
      : {
          title: adName,
          adType: "manual",
          ownerName: clientName,
          amount,
          startDate: fromDate,
          endDate: toDate,
          stateId: state,
          cityId: city,
          blockId: locations,
          content: contentText,
          image_url: imageUrl,   
          target_url: targetUrl, 
          status: status,
          adfrom: categoryType,
          moduleconfigId: selectedCategoryItem,
        };

    // Save Advertisement
    await axios.post(`${Config?.Advertisement_url}`, payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    });

    toast({
      title: "Success!",
      description: "Advertisement Added Successfully.",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });

    navigate("/ads-menu");
  } catch (error) {
    console.error(error);
    toast({
      title: "Error!",
      description: "Something went wrong while saving.",
      status: "error",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
  } finally {
    setSaving(false);
  }
};



  const handleCancel = () => navigate("/ads-menu");

 

  return (
    <Box overflowY={"schroll"} backgroundColor="#F0F4F9" height="100%">
      <HStack justifyContent="space-between" px="20px" alignItems="flex-start">
        <LeftSidebar />
        <Box width="80%">
          <HeaderBar />
          <Box p={4} bg="white" mt="1rem" padding="12px 20px">
            <Breadcrumb color="#8B8D97" padding="10px 0px 2rem 0px">
              <BreadcrumbItem>
                <BreadcrumbLink href="/overview">
                  <GoHomeFill color="#5570F1" />
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/ads-menu" color="#8B8D97" fontSize="13px">
                  Advertisement List
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink href="/ads-menu/add-new-ads" color="#8B8D97" fontSize="13px">
                  Add Advertisement
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <Box maxW="900px" overflowY={"hidden"} mx="auto" p={6}>
              <Heading as="h3" color="#45464E" fontSize="16px" fontWeight="500" mb={6} display="flex" justifyContent="center">
                Add Advertisement
              </Heading>

              <form onSubmit={handleSubmit}>
                <VStack spacing={4} align="stretch">
                  <HStack>
                    <FormControl >
                      <FormLabel isRequired fontSize="12px" color="#333333">Google Script</FormLabel>
                      <Input width={"full"} fontSize="14px" borderRadius="none" height="48px" border="1px solid" color="#333333" value={googleScript} onChange={(e) => { setGoogleScript(e.target.value); setAdType("google");}} placeholder="Enter Google Script" />
                    </FormControl>
                  </HStack>
                  <Text alignItems={"center"} textAlign={"center"}>OR</Text>
                  <HStack>

                    <FormControl >
                      <FormLabel isRequired fontSize="12px" color="#333333">Ad Name<sup>*</sup></FormLabel>
                      <Input sx={InputStl} value={adName} onChange={(e) =>  setAdName(e.target.value)} placeholder="Enter Ad Name" />
                    </FormControl>

                    <FormControl >
                      <FormLabel isRequired fontSize="12px" color="#333333">Client Name<sup>*</sup></FormLabel>
                      <Input sx={InputStl} value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Enter Client Name" />
                    </FormControl>
                  </HStack>

                  <HStack>
                      {/* 1st Dropdown */}
                      <FormControl position="relative">
                        <FormLabel fontSize="12px" color="#333333" isRequired>
                          Category Type<sup>*</sup>
                        </FormLabel>
                        <Text position="absolute" top="43px" right="135px">
                          <IoIosArrowDown />
                        </Text>
                        <Select
                          sx={InputStl}
                          icon="none"
                          placeholder="Select Category Type"
                          value={categoryType}
                          onChange={(e) => {
                            setCategoryType(e.target.value);
                            setSelectedCategoryItem(""); 
                          }}
                        >
                          <option value="Manufacturer">Manufacturer</option>
                          <option value="Distributor">Distributor</option>
                          <option value="Retailer">Retailer</option>
                        </Select>
                      </FormControl>
                    
                      {/* 2nd Dropdown */}
                      <FormControl position="relative">
                        <FormLabel fontSize="12px" color="#333333" isRequired>
                          Category Item<sup>*</sup>
                        </FormLabel>
                        <Text position="absolute" top="43px" right="135px">
                          <IoIosArrowDown />
                        </Text>
                        <Select
                          sx={InputStl}
                          icon="none"
                          placeholder={loadingCategory ? "Loading..." : "Select Item"}
                          value={selectedCategoryItem}
                          onChange={(e) => setSelectedCategoryItem(e.target.value)}
                          isDisabled={!categoryType || loadingCategory}
                        >
                          {categoryOptions.map((item) => (
                            <option key={item.id} value={item.moduleConfigId}>
                              {item.moduleName}
                            </option>
                          ))}
                        </Select>
                      </FormControl>
                    </HStack>
                     
                  <HStack>
                    <FormControl >
                      <FormLabel  isRequired fontSize="12px" color="#333333">Duration From<sup>*</sup></FormLabel>
                      <Input sx={InputStl} type="date" value={fromDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => setFromDate(e.target.value)} />
                    </FormControl>

                    <FormControl >
                      <FormLabel isRequired fontSize="12px" color="#333333">Duration To<sup>*</sup></FormLabel>
                      <Input sx={InputStl} type="date" value={toDate} min={fromDate || new Date().toISOString().split("T")[0]} onChange={(e) => setToDate(e.target.value)} />
                    </FormControl>
                  </HStack>

                  <HStack>
                         {/* State Dropdown */}
                         <FormControl position="relative">
                           <FormLabel isRequired fontSize="12px" color="#333333">
                             State<sup>*</sup>
                           </FormLabel>
                           <Text position="absolute" top="43px" right="135px">
                             <IoIosArrowDown />
                           </Text>
                           <Select
                             sx={InputStl}
                             icon="none"
                             placeholder={loadingStates ? "Loading..." : "Select State"}
                             value={state}
                             onChange={(e) => {
                               setState(e.target.value);
                               setCity("");          
                               setCitiesData([]);    
                             }}
                             isDisabled={loadingStates}
                           >
                             {statesData.map((st) => (
                               <option key={st.id} value={st.id}>
                                 {st.state}
                               </option>
                             ))}
                           </Select>
                         </FormControl>
                       
                         {/* City Dropdown */}
                         <FormControl position="relative">
                           <FormLabel isRequired fontSize="12px" color="#333333">
                             City<sup>*</sup>
                           </FormLabel>
                           <Text position="absolute" top="43px" right="135px">
                             <IoIosArrowDown />
                           </Text>
                           <Select
                             sx={InputStl}
                             icon="none"
                             placeholder={
                               state
                                 ? loadingCities
                                   ? "Loading..."
                                   : "Select City"
                                 : "Select State first"
                             }
                             value={city}
                             onChange={(e) => setCity(e.target.value)}
                             isDisabled={!state || loadingCities}
                           >
                             {citiesData.map((ct) => (
                               <option key={ct.id} value={ct.id}>
                                 {ct.city}
                               </option>
                             ))}
                           </Select>
                         </FormControl>
                       </HStack>
                       
                                     <Text isRequired>Add Loction<sup>*</sup></Text>
                                     <HStack>
                                       <FormControl position="relative" >
                         <FormLabel fontSize="12px" color="#333333">
                           Select Location<sup>*</sup>
                         </FormLabel>
                         <Text position="absolute" top="43px" right="135px">
                           <IoIosArrowDown />
                         </Text>
                         <Select 
                           sx={InputStl}
                           icon="none"
                           placeholder={loading ? "Loading..." : "Select Location"}
                           onChange={handleLocationChange}
                           isDisabled={loading}
                         >
                           {locationsData.map((loc) => (
                             <option key={loc.id} value={loc.block_id}>
                               {loc.name}
                             </option>
                           ))}
                         </Select>
                       </FormControl>
                  <FormControl >
                      <FormLabel isRequired fontSize="12px" color="#333333">Amount<sup>*</sup></FormLabel>
                      <Input sx={InputStl} type="number" value={amount} onChange={(e) =>  setAmount(e.target.value)} placeholder="Enter Amount" />
                    </FormControl>
                   </HStack>
                  <FormControl>
                    <FormLabel isRequired fontSize="12px" color="#333333">Content Text<sup>*</sup></FormLabel>
                    <Textarea placeholder="Enter ad text content" value={contentText} onChange={(e) => setContentText(e.target.value)} />
                  </FormControl>
                  
                   <FormControl>
                    <FormLabel isRequired fontSize="12px" color="#333333">Content Image<sup>*</sup></FormLabel>
                    <HStack>
                      <Input
                      type="file"
                      accept="image/*"
                      display="none"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      border="1px solid #0162E8"
                      color="#0162E8"
                      bg="#ecf0fa"
                      w="144px"
                      h="40px"
                      onClick={handleBrowseClick}
                    >
                      Browse Files
                    </Button>
                  
                    {/* File name preview */}
                    {contentImg && (
                      <Text mt={2} fontSize="sm" color="gray.600">
                        Selected: {contentImg.name}
                      </Text>
                    )}
                    </HStack>
                  </FormControl>

                   <FormControl>
                   <FormLabel>Image Target URL</FormLabel>
                   <Input
                     w="full"
                     type="url"
                     placeholder="https://example.com/landing-page"
                     value={targetUrl}
                     onChange={(e) => setTargetUrl(e.target.value)}
                   />
                 </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel isRequired mb="0">Active Status<sup>*</sup></FormLabel>
                    <Switch onChange={(e) => setStatus(e.target.checked ? "active" : "inactive")} isChecked={status === "active"} />
                  </FormControl>

                  <HStack justifyContent="flex-end" spacing={4} mt={6}>
                    <Button onClick={handleCancel} variant="outline" bg="#D4D4D8" cursor="pointer" px="3rem" py="0.5rem" color="#fff" borderRadius="full" minW="fit-content" _hover={{ bg: "#6b6b6dff" }}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={saving}
                      px="3rem"
                      py="0.5rem"
                      color="#fff"
                      borderRadius="full"
                      minW="fit-content"
                      bg="#3e60aa"
                      _hover={{ bg: "#14204A" }}
                    >
                      {saving ? <Spinner size="sm" mr={2} /> : "Save"}
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </Box>
          </Box>
          <Footer />
        </Box>
      </HStack>
    </Box>
  );
};

export default AddAdvertisement;
