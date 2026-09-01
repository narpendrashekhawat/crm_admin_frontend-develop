import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Select,
  Text,
  useToast,
  Spinner,
  HStack,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Textarea,
  Switch,
  VStack,
  Image,IconButton
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { GoHomeFill } from "react-icons/go";
import axios from "axios";
import { Config } from "../Utils/Config";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../Header/HeaderBar";
import Footer from "../footer";
import eyeIcon from "../../assets/icons/eye.svg";
import { FaDownload } from "react-icons/fa";

const EditAdvertisement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [ad, setAd] = useState({
    id: "",
    title: "",
    content: "",
    image_url: "",
    target_url: "",
    ownerName: "",
    amount: "",
    startDate: "",
    endDate: "",
    status: "",
    adType: "",
    stateId: "",
    cityId: "",
    blockId: "",
    adfrom: "",
    moduleconfigId: "",
    state: "",
    city: "",
    moduleName: "",
    google_ad_code: "", 
  });

  const [statesData, setStatesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);
  const [locationsData, setLocationsData] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingCategory, setLoadingCategory] = useState(false);
  const [contentImg, setContentImg] = useState(null);
  const fileInputRef = useRef(null);

  //  Fetch Advertisement Details
  useEffect(() => {
    const fetchAd = async () => {
      try {
        const res = await axios.get(`${Config.Advertisement_url}/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
       console.log(res.data.apiData, "apiData4567890");
      //  console.log("Advertisement URL:", `${Config.Advertisement_url}/${id}`);

        const data = res.data?.apiData;
        if (!data) throw new Error("Advertisement not found");

        const loc = data.ad_locations?.[0];
        const cityData = loc?.city;
        const stateData = cityData?.state;

        setAd({
          id: data?.id,
          title: data?.title || "",
          google_ad_code: data?.google_ad_code || "",
          content: data?.content || "",
          image_url: data?.image_url || "",
          target_url: data?.target_url || "",
          ownerName: data?.ownerName || "",
          amount: data?.amount || "",
          startDate: data?.startDate ? data?.startDate.slice(0, 10) : "",
          endDate: data?.endDate ? data.endDate.slice(0, 10) : "",
          status: data?.status || "inactive",
          adType: data?.adType || "manual",
          stateId: stateData?.id ? Number( stateData.id) : 0,
          cityId: cityData?.id ? Number(cityData.id) : 0,
          blockId: data?.blockId || "",
          adfrom: data?.adfrom || "",
          moduleconfigId: data?.moduleconfigId || "",
          state: stateData?.state || "",
          city: cityData?.city || "",
          moduleName: data?.moduleconfig?.moduleName || "",
        });
      } catch (err) {
        console.error(err);
        toast({
          title: "Failed to load advertisement",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, [id, toast]);

  //  Fetch States
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const res = await axios.get(`${Config.states}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        console.log(res.data, "state");
        
        setStatesData(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  //  Fetch Cities when State changes
  useEffect(() => {
    const fetchCities = async () => {
      if (!ad.stateId) return;
      setLoadingCities(true);
      try {
        const res = await axios.get(`${Config.states}?stateId=${ad.stateId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setCitiesData(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, [ad.stateId]);

  //  Fetch Locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await axios.get(`${Config.Locations_url}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setLocationsData(res.data.apiData || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchLocations();
  }, []);

  //  Fetch Category Items when Category Type changes
  useEffect(() => {
    const fetchCategoryData = async () => {
      if (!ad.adfrom) return;
      setLoadingCategory(true);
      try {
        const res = await axios.get(`${Config.ad_modules_url}?category=${ad.adfrom}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
        });
        setCategoryOptions(res.data.apiData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingCategory(false);
      }
    };
    fetchCategoryData();
  }, [ad.adfrom]);

  const handleChange = (key, value) => {
  // Keys that should always be numeric
  const numericKeys = ["stateId", "cityId", "blockId", "moduleconfigId"];
  setAd((prev) => ({
    ...prev,
    [key]: numericKeys.includes(key) ? Number(value) : value,
  }));
};


  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) setContentImg(file);
  };

  const handleSave = async () => {
    setSaving(true);
    try {

      let image_url = "";
      
          //  Upload image if manual ad
          if ( contentImg) {
            const formData = new FormData();
            formData.append("file", contentImg); 
            const uploadRes = await axios.post(`${Config?.imageUpdate_url}`, formData, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("authToken")}`,
                "Content-Type": "multipart/form-data",
              },
            });
             console.log("Image Upload Response:", uploadRes.data.apiData[0].url);
            
            const uploadedFile = uploadRes.data?.apiData?.[0];
            image_url = uploadedFile?.url || ""; 
      
            if (!image_url) {
              throw new Error("Image upload failed: No image URL returned");
            }
          }
               const payload = {
            id: ad.id,
            adType: ad.adType,
            status: ad.status,
          };
          
          if (ad.adType === "manual") {
            payload.title = ad.title;
            payload.content = ad.content;
            payload.image_url = image_url; 
            payload.target_url = ad.target_url;
            payload.ownerName = ad.ownerName;
            payload.stateId = ad.stateId;
            payload.cityId = ad.cityId;
            payload.blockId = ad.blockId ? Number(ad.blockId) : null;
            payload.amount = ad.amount ? `${ad.amount}` : "0.00";
            payload.startDate = new Date(ad.startDate).toISOString();
            payload.endDate = new Date(ad.endDate).toISOString();
            payload.adfrom = ad.adfrom || null;
            payload.moduleconfigId = ad.moduleconfigId ? Number(ad.moduleconfigId) : null;
          } else if (ad.adType === "google") {
            payload.google_ad_code = ad.google_ad_code || null;
          }


      await axios.put(`${Config.Advertisement_url}/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
      });

      toast({
        title: "Advertisement updated successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/ads-menu");
    } catch (err) {
      console.error(err);
      toast({
        title: "Update failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" h="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  function viewDetails(imageUrl) {
  if (!imageUrl) return;
  window.open(imageUrl, "_blank"); 
}


  return (
    <Box backgroundColor="#F0F4F9" height="100%">
      <HStack justifyContent="space-between" px="20px" alignItems="flex-start">
        <LeftSidebar />
        <Box width="80%">
          <HeaderBar />
          <Box p={4} bg="white" mt="1rem" overflow={"hidden"} padding="12px 20px">
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
                <BreadcrumbLink href={`/ads-menu/advertisements/${id}`} color="#8B8D97" fontSize="13px">
                  Edit Advertisement
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <Box maxW="900px" mx="auto" p={6}>
              <Heading as="h3" color="#45464E" fontSize="26px" fontWeight="500" mb={6} textAlign="center">
                Edit Advertisement
              </Heading>

              <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            {ad.adType === "manual" && (
              <>
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input value={ad.title} onChange={(e) => handleChange("title", e.target.value)} />
                </FormControl>
          
                <FormControl>
                  <FormLabel>Client Name</FormLabel>
                  <Input value={ad.ownerName} onChange={(e) => handleChange("ownerName", e.target.value)} />
                </FormControl>
          
                <FormControl>
                  <FormLabel>Category Type</FormLabel>
                  <Select value={ad.adfrom || ""} onChange={(e) => handleChange("adfrom", e.target.value)} placeholder="Select Category Type">
                    <option value="Manufacturer">Manufacturer</option>
                    <option value="Distributor">Distributor</option>
                    <option value="Retailer">Retailer</option>
                  </Select>
                </FormControl>
          
                <FormControl>
                  <FormLabel>Category Item</FormLabel>
                  <Select
                    value={ad.moduleconfigId || ""}
                    onChange={(e) => handleChange("moduleconfigId", e.target.value)}
                    isDisabled={!ad.adfrom || loadingCategory}
                  >
                    {categoryOptions.map((item) => (
                      <option key={item.moduleConfigId} value={item.moduleConfigId}>
                        {item.moduleName}
                      </option>
                    ))}
                  </Select>
                </FormControl>
          
                {/* Other manual fields */}
                <FormControl>
                  <FormLabel>Start Date</FormLabel>
                  <Input type="date" value={ad.startDate} min={new Date().toISOString().split("T")[0]} onChange={(e) => handleChange("startDate", e.target.value)} />
                </FormControl>
          
                <FormControl>
                  <FormLabel>End Date</FormLabel>
                  <Input type="date" value={ad.endDate} min={ new Date().toISOString().split("T")[0]} onChange={(e) => handleChange("endDate", e.target.value)} />
                </FormControl>
          
                <FormControl>
                  <FormLabel>State</FormLabel>
                  <Select
                    placeholder="Select state"
                    value={ad.stateId || ""}
                    onChange={(e) => {
                      handleChange("stateId", e.target.value);
                      handleChange("cityId", "");
                    }}
                  >
                    {statesData.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.state}
                      </option>
                    ))}
                  </Select>
                </FormControl>
          
                <FormControl>
                  <FormLabel>City</FormLabel>
                  <Select
                    placeholder= "Select City"
                    value={ad.cityId || ""}
                    onChange={(e) => handleChange("cityId", e.target.value)}
                  >
                    {citiesData.map((ct) => (
                      <option key={ct.id} value={ct.id}>
                        {ct.city}
                      </option>
                    ))}
                  </Select>
                </FormControl>
          
                <FormControl>
                  <FormLabel>Location</FormLabel>
                  <Select
                    placeholder="Select Location"
                    value={ad.blockId}
                    onChange={(e) => handleChange("blockId", e.target.value)}
                  >
                    {locationsData.map((loc) => (
                      <option key={loc.id} value={loc.block_id}>
                        {loc.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>
          
                <FormControl>
                  <FormLabel>Amount</FormLabel>
                  <Input value={ad.amount} onChange={(e) => handleChange("amount", e.target.value)} />
                </FormControl>
          
                <FormControl gridColumn="span 2">
                  <FormLabel>Content Text</FormLabel>
                  <Textarea value={ad.content} onChange={(e) => handleChange("content", e.target.value)} />
                </FormControl>

                <FormControl gridColumn="span 2">
                  <FormLabel>Content Image</FormLabel>
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
                    onClick={() => fileInputRef.current.click()}
                  >
                    Browse Files
                  </Button>
                  {contentImg && (
                    <Text mt={2} fontSize="sm" color="gray.600">
                      Selected: {contentImg.name}
                    </Text>
                  )}
                  {ad.image_url && (
                  <IconButton
                      onClick={() => viewDetails(ad.image_url)}
                      icon={<FaDownload/>}
                      variant="ghost"
                      size="lg"
                      marginLeft={"12px"}
                      bg={"#a6c9f0ff"}
                    />
                    )}
                </FormControl>
                
                <FormControl w={"full"} >
                   <FormLabel>Image Target URL</FormLabel> 
                   <Input w={"full"}
                   type="url" placeholder="https://example.com/landing-page" 
                   value={ad.target_url} 
                   onChange={(e) => handleChange("target_url", e.target.value)} /> 
                  </FormControl>
                  
              </>
            )}
          
             {ad.adType === "google" && (
               <FormControl gridColumn="span 2">
                 <FormLabel>Google Ad Code</FormLabel>
                 <Textarea
                   value={ad.google_ad_code}
                   onChange={(e) => handleChange("google_ad_code", e.target.value)}
                   placeholder="Paste Google Ad code here"
                 />
               </FormControl>
             )}
           </Grid>
           <VStack marginTop={"20px"}>
             {/* Status switch should show in both types */}
             <FormControl display={"flex"} alignItems={"center"}>
               <FormLabel>Status</FormLabel>
               <Switch
                 paddingBottom={"6px"}
                 isChecked={ad.status === "active"}
                 onChange={(e) => handleChange("status", e.target.checked ? "active" : "inactive")}
               />
             </FormControl>
             </VStack>

              <Flex mt={8} justify="flex-end">
                <Button
                  variant="outline"
                  bg="#D4D4D8"
                  cursor="pointer"
                  px="3rem"
                  py="0.5rem"
                  color="#fff"
                  borderRadius="full"
                  mr={3}
                  onClick={() => navigate("/ads-menu")}
                >
                  Cancel
                </Button>
                <Button
                  px="3rem"
                  py="0.5rem"
                  color="#fff"
                  borderRadius="full"
                  bg="#3e60aa"
                  _hover={{ bg: "#14204A" }}
                  isLoading={saving}
                  onClick={handleSave}
                >
                  {saving ? <Spinner size="sm" mr={2} /> : "Save"}
                </Button>
              </Flex>
            </Box>
          </Box>
          <Footer />
        </Box>
      </HStack>
    </Box>
  );
};

export default EditAdvertisement;
