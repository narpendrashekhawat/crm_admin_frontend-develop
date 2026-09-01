import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Box, Input, Select, Switch, Flex, Button, Heading, Text,
  HStack, VStack, Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  useToast,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import axios from "axios";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import { useParams } from "react-router-dom";
import { useAuth } from "../../../src/components/Context/authContext";
import { Config } from "../../../src/components/Utils/Config";
import Footer from "../footer";
import { useNavigate } from "react-router-dom";
import { LuChevronDown, LuChevronUp, LuCheck } from "react-icons/lu";

const ProductDropdown = ({
  name,
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  label,
  isRequired = false,
  isInvalid = false,
  errorMsg = "This field is required",
  width = "107%",
  isDisabled = false,
  height = "48px",
  fontSize = "15px",
  bg = "#eff1f999",
}) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const optionRefs = useRef([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Find label of currently selected value
  const selectedLabel = options.find((opt) => opt.value === value)?.label || "";

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside, true); // ← true = capture phase, fires first
    return () => document.removeEventListener("mousedown", handleClickOutside, true);
  }, []);

  // Scroll active option into view
  useEffect(() => {
    if (activeIndex >= 0 && optionRefs.current[activeIndex]) {
      optionRefs.current[activeIndex].scrollIntoView({ block: "nearest" });
    }
  }, [activeIndex]);

  const handleSelect = (option) => {
    onChange({ target: { name, value: option.value } });
    setOpen(false);
    setActiveIndex(-1);

    // 🔥 ensures focus returns & prevents stuck state
    dropdownRef.current?.querySelector("button")?.focus();
  };

  const handleKeyDown = (e) => {
    if (!open && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(0); // 🔥 ADD THIS LINE
      return;
    }
    if (!open) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0) {
          handleSelect(options[activeIndex]);
        } else if (value) {
          const selectedOption = options.find(opt => opt.value === value);
          if (selectedOption) handleSelect(selectedOption);
        }
        break;
      case "Escape":
        setOpen(false);
        setActiveIndex(-1);
        break;
      default:
        break;
    }
  };

  return (
    <FormControl isRequired={isRequired} isInvalid={isInvalid} width={width}>
      {label && (
        <FormLabel fontSize="13px" color="#8B8D97" mb="4px">{label}</FormLabel>
      )}

      {/* Trigger */}
      <Box position="relative" ref={dropdownRef}>
        <Box
          as="button"
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!isDisabled) {
              setOpen((prev) => !prev);
              setActiveIndex(0); // 🔥 ensures keyboard always works
            }
          }} onKeyDown={handleKeyDown}
          width="100%"
          height={height}
          px={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          bg={isInvalid ? "#FFF5F5" : bg}
          border="1px solid"
          borderColor={isInvalid ? "#E53E3E" : open ? "#3182ce" : "#E2E8F0"}
          borderRadius="6px"
          fontSize={fontSize}
          cursor={isDisabled ? "not-allowed" : "pointer"}
          opacity={isDisabled ? 0.6 : 1}
          _hover={{ borderColor: isDisabled ? "#E2E8F0" : "#CBD5E0" }}
          _focusVisible={{ outline: "none", borderColor: "#3182ce", boxShadow: "0 0 0 1px #3182ce" }}
        >
          <Text
            fontSize={fontSize}
            color={selectedLabel ? "#45464E" : "#8B8D97"}
            noOfLines={1}
          >
            {selectedLabel || placeholder}
          </Text>
          {open ? <LuChevronUp size={16} color="#8B8D97" /> : <LuChevronDown size={16} color="#8B8D97" />}
        </Box>

        {/* Dropdown list — renders below, fixed zIndex above everything */}
        {open && (
          <Box
            position="fixed"
            // Calculate position dynamically using the ref
            top={(() => {
              const rect = dropdownRef.current?.getBoundingClientRect();
              return rect ? `${rect.bottom + 4}px` : "auto";
            })()}
            left={(() => {
              const rect = dropdownRef.current?.getBoundingClientRect();
              return rect ? `${rect.left}px` : "auto";
            })()}
            width={(() => {
              const rect = dropdownRef.current?.getBoundingClientRect();
              return rect ? `${rect.width}px` : "100%";
            })()}
            bg="white"
            boxShadow="0 4px 12px rgba(0,0,0,0.12)"
            borderRadius="6px"
            border="1px solid #E2E8F0"
            zIndex={99999}
            maxH="200px"
            overflowY="auto"
          >
            {options.length === 0 ? (
              <Box px={3} py={2}>
                <Text fontSize="13px" color="#8B8D97">No options</Text>
              </Box>
            ) : (
              options.map((option, index) => (
                <HStack
                  key={option.id}
                  px={3}
                  py="10px"
                  cursor="pointer"
                  bg={activeIndex === index ? "blue.50" : value === option.value ? "blue.50" : "white"}
                  _hover={{ bg: "gray.50" }}
                  // ✅ AFTER
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleSelect(option);   // ← move selection to onMouseDown, fires before blur
                  }}
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => setActiveIndex(index)}
                  ref={(el) => (optionRefs.current[index] = el)}
                  justify="space-between"
                >
                  <Text fontSize="13px" color="#45464E">{option.label}</Text>
                  {value === option.value && <LuCheck size={14} color="#3E60AA" />}
                </HStack>
              ))
            )}
          </Box>
        )}
      </Box>

      {isInvalid && (
        <FormErrorMessage fontSize="12px">{errorMsg}</FormErrorMessage>
      )}
    </FormControl>
  );
};

const AddProductForm = ({ productDetails, getProductDetailsbyId }) => {
  const { id } = useParams()
  console.log(id, 'productId')
  const MfgId = 'DEFAULT';
  const { authToken } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    PName: "",
    ProductForm: "",
    Package: "",
    SaltComposition: "",
    LOCKED: 0,
    manufacturerId: '',
    Quantity: '',
    BoxPack: null,
    CasePack: null,
    GSTPer: null,
    DNick: '',
    DMfg: '',
    PNick: '',
    PMfg: '',
    PCategory: '',
    UQC: '',

  });

  const toast = useToast();

  const [manufacturers, setManufacturers] = useState([]);
  const [loading, setloading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('')
  const fetchManufacturer = async (companyName) => {
    setloading(true);
    try {
      const response = await axios.get(`${Config?.manufacturers_list}?limit=10000`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`
        }
      });


      if (response.data.status === 200) {
        setManufacturers(response?.data?.data?.manufacturers);
      } else {

      }
    }
    catch (err) {
      setError("Error fetching data");

      console.error(err);
    }

    setloading(false);
  };

  console.log(manufacturers, ";;;;;;;;;;;;;;;;;;;;;;;");

  useEffect(() => {
    fetchManufacturer()
  }, [])

  const manufacturer = {
    CompanyName: "ePharma",
    ManufacturerID: "1234"
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || ""
    }));
  };

  // Handle select changes
  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || ""
    }));
  };

  const handleSwitchChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      LOCKED: e.target.checked ? 1 : 0
    }));
  };

  const handleClearForm = () => {
    setFormData({
      PName: "",
      PackagingDetails: "",
      Package: "",
      ProductForm: "",
      Quantity: "",
      SaltComposition: "",
      Generic: "0",
      PCategory: "",
      DPCO: 0,
      BoxPack: null,
      CasePack: null,
      GSTPer: null,
      MRP: "",
      PTR: "",
      DNick: "",
      DMfg: "",
      PNick: "",
      PMfg: "",
      HSN: "",
      LOCKED: 0,
      manufacturerId: "",
      UQC: "",
    });

    // toast({
    //   title: "Form Cleared",
    //   description: "All fields have been cleared successfully",
    //   status: "info",
    //   duration: 2000,
    //   isClosable: true,
    // });
    navigate("/product-catalogue");
  };


  // Handle API request
  const handleAddProduct = async () => {
    // Validation for required fields
    const requiredFields = {
      PName: 'Product Name',
      SaltComposition: 'Salt Composition',
      Package: 'Package',
      Quantity: 'Quantity',
      ProductForm: 'Product Form',
      HSN: 'HSN'
    };

    const missingFields = [];

    Object.keys(requiredFields).forEach(field => {
      if (!formData[field] || formData[field].toString().trim() === '') {
        missingFields.push(requiredFields[field]);
      }
    });

    if (missingFields.length > 0) {
      toast({
        title: "Required Fields Missing",
        description: `Please fill in: ${missingFields.join(', ')}`,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: 'top'
      });
      return; // Stop execution if validation fails
    }

    try {
      const response = await axios.post(`${Config?.AddProductForm_url}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`
        }
      });

      if (response?.status === 200 || response?.data?.status === 201) {
        toast({
          description: response?.data?.message || 'Product Added Successfully',
          duration: 2000,
          position: 'bottom-center',
          status: 'success',
          isClosable: true
        });

        // Reset form after successful submission
        setFormData({
          PName: "",
          PackagingDetails: "",
          Package: "",
          ProductForm: "",
          Quantity: "",
          SaltComposition: "",
          Generic: "0",
          PCategory: "",
          DPCO: 0,
          BoxPack: null,
          CasePack: null,
          GSTPer: null,
          MRP: "",
          PTR: "",
          DNick: "",
          DMfg: "",
          PNick: "",
          PMfg: "",
          HSN: "",
          LOCKED: 0,
          manufacturerId: ""
        });
      }
    } catch (error) {
      console.log(error, "Error in fetching API response!");

      // Show error toast for API errors
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to add product. Please try again.",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: 'top'
      });
    }
    navigate("/product-catalogue");
  };


  // const handleEditProduct = async () => {
  //   try {
  //     const response = await axios.post(`${Config?.AddProductForm_url}`, {
  //       PId: id,
  //       LOCKED: formData?.LOCKED || 0,
  //       PName: formData?.PName,
  //       SaltComposition: formData?.SaltComposition,
  //       ProductForm: formData?.ProductForm,
  //       Quantity: formData?.Quantity,
  //       BoxPack: formData?.BoxPack,
  //       CasePack: formData?.CasePack,
  //       DMfg: formData?.DMfg,
  //       DNick: formData?.DNick,
  //       GSTPer: formData?.GSTPer,
  //       PMfg: formData?.PMfg,
  //       PNick: formData?.PNick,
  //       PCategory: formData?.PCategory,
  //       UQC: formData?.UQC,


  //     }, {
  //       headers: {
  //         Authorization: `Bearer ${authToken}`
  //       }
  //     })
  //     if (response?.status === 200) {
  //       toast({
  //         description: response?.data?.message || 'Product Updated Successfully',
  //         duration: 2000,
  //         isClosable: true,
  //         status: 'success'
  //       })
  //       getProductDetailsbyId();
  //     } else {
  //       toast({
  //         description: response?.data?.message || 'Product not found',
  //         duration: 2000,
  //         isClosable: true,
  //         status: 'error'
  //       })
  //     }
  //   } catch (error) {
  //     console.log(error, "Error in fetching API response.")
  //     toast({
  //       description: 'Something went wrong, please try again.',
  //       duration: 2000,
  //       isClosable: true,
  //       status: 'error'
  //     })
  //   }
  // }

  const [dropdowns, setDropdowns] = useState({});

  useEffect(() => {
    const fetchDropdowns = async () => {
      const res = await axios.get(`${Config.product_dropdowns}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.data?.status == 200) {
        setDropdowns(res.data?.apiData);
      }
    }

    fetchDropdowns();
  }, []);


  return (


    <Box backgroundColor='#F0F4F9' height={"100%"}>
      <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
        <LeftSidebar />
        <Box width='100%'>
          <HeaderBar />
          <>
            <Box p={4} bg="white" mt='1rem' padding='12px 20px' borderRadius='15px 15px 0px 0px'>
              <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px'>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/overview'><GoHomeFill color="#5570F1" /></BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href='/product-catalogue' color='#5570F1' fontSize='13px'>Product Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbItem>
                  <BreadcrumbLink href='' color='#8B8D97' fontSize='13px'>New Product</BreadcrumbLink>
                </BreadcrumbItem>
              </Breadcrumb>

              <HStack alignItems='center'>
                <Box width='1238px' height="auto" overflow={"visible"} >
                  <Heading as="h3" color='#45464E' fontSize='16px' fontWeight='500' mb={6} height='40px' display="flex" justifyContent="center">
                    {"Add New Product"}
                  </Heading>
                  <HStack alignItems='flex-start' gap='18px' m="12px">

                    <VStack gap='20px' alignItems='baseline' width='100%'  >

                      <HStack>
                        <Input name="HSN" value={formData.HSN} onChange={handleChange} placeholder="HSN" bg='#eff1f999' fontSize='15px' height='48px' />
                      </HStack>


                      <HStack width='100%'>
                        <Select
                          name="manufacturerId"
                          value={formData.manufacturerId}
                          onChange={handleChange}
                          placeholder='Search Manufacturer Name'
                          bg='#eff1f999'
                          fontSize='15px'
                          height='48px'
                          width={'1300px'}
                        >
                          {manufacturers?.map((data, index) => (
                            <option key={data?.ManufacturerID || index} value={data?.ManufacturerID}>
                              {data?.CompanyName}
                            </option>
                          ))}
                        </Select>
                        <Input name="PName" value={formData.PName} onChange={handleChange} placeholder="Product Name" bg='#eff1f999' fontSize='15px' height='48px' />
                        <Input name="SaltComposition" value={formData.SaltComposition} onChange={handleChange} placeholder="Salt Composition" bg='#eff1f999' fontSize='15px' height='48px' />
                      </HStack>
                      <HStack width='100%'>
                        {/* <Input name="Package" value={formData.Package} onChange={handleChange} placeholder="Package" bg='#eff1f999' fontSize='15px' height='48px' /> */}
                        <ProductDropdown
                          name={"Package"}
                          value={formData.Package}
                          onChange={handleChange}
                          options={dropdowns?.PRODUCT_PACKAGE || []}
                          placeholder="Select Package"
                          isRequired
                          height="48px"
                        // isInvalid={!formData.Package}
                        />
                        {/* <Input name="ProductForm" value={formData.ProductForm} onChange={handleChange} placeholder="product form" bg='#eff1f999' fontSize='15px' height='48px' /> */}
                        <ProductDropdown
                          name={"ProductForm"}
                          value={formData.ProductForm}
                          onChange={handleChange}
                          options={dropdowns?.PRODUCT_FORM || []}
                          placeholder="Select Product Form"
                          isRequired
                          height="48px"
                        // isInvalid={!formData.Package}
                        />
                        <Input name="Quantity" value={formData.Quantity} onChange={handleChange} placeholder="Quantity" bg='#eff1f999' fontSize='15px' height='48px' />
                      </HStack>


                      <HStack width={'100%'}>
                        <Input name="CasePack" value={formData.CasePack} onChange={handleChange} placeholder="CasePack" bg='#eff1f999' fontSize='15px' height='48px' />
                        <Input name="GSTPer" value={formData.GSTPer} onChange={handleChange} placeholder="GSTPer" bg='#eff1f999' fontSize='15px' height='48px' />
                        <Input name="DNick" value={formData.DNick} onChange={handleChange} placeholder="DNick" bg='#eff1f999' fontSize='15px' height='48px' />
                      </HStack>

                      <HStack width={'100%'}>
                        <Input name="DMfg" value={formData.DMfg} onChange={handleChange} placeholder="DMfg" bg='#eff1f999' fontSize='15px' height='48px' />
                        <Input name="PNick" value={formData.PNick} onChange={handleChange} placeholder="PNick" bg='#eff1f999' fontSize='15px' height='48px' />
                        <Input name="PMfg" value={formData.PMfg} onChange={handleChange} placeholder="PMfg" bg='#eff1f999' fontSize='15px' height='48px' />
                      </HStack>

                      <HStack width={'100%'}>
                        <Input name="BoxPack" value={formData.BoxPack} onChange={handleChange} placeholder="BoxPack" bg='#eff1f999' fontSize='15px' height='48px' />
                        <Input name="UQC" value={formData.UQC} onChange={handleChange} placeholder="UQC Code" bg='#eff1f999' fontSize='15px' height='48px' />
                        {/* <Select
                        name="PCategory"
                        value={formData.PCategory}
                        onChange={handleChange}
                        placeholder="Select PCategory"
                        bg="#eff1f999"
                        fontSize="15px"
                        height="48px"
                        width="1300px"
                      >
                        <option value="H">H</option>
                        <option value="H1">H1</option>
                        <option value="General">General</option>
                        <option value="Narcotics">Narcotics</option>

                      </Select> */}
                        <ProductDropdown
                          name={"PCategory"}
                          value={formData.PCategory}
                          onChange={handleChange}
                          options={dropdowns?.PRODUCT_CATEGORY || []}
                          placeholder="Product Category"
                          isRequired
                          height="48px"
                        // isInvalid={!formData.Package}
                        />
                        <Text mr="2" color='#8B8D97' fontWeight='500'>Status</Text>
                        <Text m="24px" fontSize='14px' color='#83898C'> {formData.LOCKED === 1 ? "Locked" : "Unlocked"}</Text>
                        <Switch isChecked={formData.LOCKED === 1} onChange={handleSwitchChange} sx={{
                          "& .chakra-switch__track": {
                            backgroundColor: formData.LOCKED === 1 ? "#9a9fb854" : "green.400",
                            // width: "32px",
                          },
                          // "& .chakra-switch__thumb": { bg: "#BBC5CB" },
                        }} />
                      </HStack>

                      <HStack width='100%' justifyContent="end" >

                        <Button
                          variant="outline"
                          width='120px'
                          height='36px'
                          borderRadius='12px'
                          onClick={handleClearForm}> Cancel  </Button>
                        <Button
                          onClick={() => handleAddProduct()}
                          p='17px 16px' backgroundColor='#3E60AA' color='white' fontSize='14px' fontWeight='500' borderRadius='12px' w='120px'>{"Save"}</Button>
                      </HStack>


                      <VStack justify="space-between" align="baseline" width='100%'>
                        {/* <Flex align="center" w='100%' justifyContent='space-between' width='33%' paddingLeft='5px'> */}

                        {/* </Flex> */}

                      </VStack>
                    </VStack>


                  </HStack>
                </Box>
              </HStack>
            </Box>
          </>
          <Footer />
        </Box>
      </HStack>


    </Box>


  );

};

export { ProductDropdown };
export default AddProductForm;