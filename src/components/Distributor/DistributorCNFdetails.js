import { useState, useEffect } from "react";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, ButtonGroup, Text, VStack, Spinner, Alert, AlertIcon, HStack, Badge, useToast, Select, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, ModalFooter } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa"; // Placeholder for email verification icon
import GeneralDetails from "../ProfileElements/GeneralDetails/GeneralDetails";
import SubscriptionsEntities from "../ProfileElements/Subscriptions_Entitites/Subscriptions_Entities";
import ProductCatalogue from "../ProfileElements/ProductCatalogue/ProductCatalogue";
import Addresses from "../../components/ProfileElements/Addresses/Addresses";
import { useParams } from "react-router-dom";
import useAxios from "../Context/axiosInstance";
import DocumentsUpload from "../ProfileElements/DocumentUpload/DocumentUpload";
import RoleDetails from "../../components/ProfileElements/Role Details/RoleDetails";
import { Config } from "../Utils/Config";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../footer";
import Distributor from "../../pages/DistributorPage/Distributor";
import InvoiceSeries from "../ProfileElements/Invoice/invoiceSeries"
import BankDetails from "../ProfileElements/Bank/BankDetails";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";
import EmployeeDetails from "../ProfileElements/EmployeeDetails/employeeDetails";


const TableHeadingSubscription = ["Subscription", "Plan", "Amount", "Start Date", "Next Renewal", "Status"];
const TableHeadingEntities = ["name", "userName", "address", "createdAt", "deletedAt", "status"];
const TableHeadingDocuments = ["documentName", "imageSize", "updatedAt"];

// Static document data
const documentsData = [
  {
    "id": 1,
    "File Name": "PAN",
    "File Details": "Pending Documents",
    "Upload date": "--"
  },
  {
    "id": 2,
    "File Name": "CIN",
    "File Details": "28.50KB",
    "Upload date": "16/11/2022"
  },
  {
    "id": 3,
    "File Name": "Drug License",
    "File Details": "28.50KB",
    "Upload date": "16/11/2022"
  },
  {
    "id": 4,
    "File Name": "Manufacturing License",
    "File Details": "28.50KB",
    "Upload date": "16/11/2022"
  },
  {
    "id": 5,
    "File Name": "Drug License",
    "File Details": "28.50KB",
    "Upload date": "16/11/2022"
  },
  {
    "id": 6,
    "File Name": "ISO",
    "File Details": "28.50KB",
    "Upload date": "16/11/2022"
  }
];

// Static subscription data
const subscriptionData = [
  {
    "id": 1,
    "Subscription": "AI Reports",
    "Plan": "Monthly",
    "Amount": "Rs 2000.00",
    "StartDate": "16/11/2022",
    "NextRenewal": "16/12/2022",
    "isActive": true
  },
  {
    "id": 2,
    "Subscription": "Cloud Storage",
    "Plan": "Annual",
    "Amount": "Rs 15000.00",
    "StartDate": "01/01/2023",
    "NextRenewal": "01/01/2024",
    "isActive": true
  },
  {
    "id": 3,
    "Subscription": "Cyber Security Suite",
    "Plan": "Quarterly",
    "Amount": "Rs 5000.00",
    "StartDate": "05/06/2022",
    "NextRenewal": "05/09/2022",
    "isActive": false
  },
  {
    "id": 4,
    "Subscription": "Business Intelligence",
    "Plan": "Monthly",
    "Amount": "Rs 2500.00",
    "StartDate": "10/03/2023",
    "NextRenewal": "10/04/2023",
    "isActive": true
  },
  {
    "id": 5,
    "Subscription": "IoT Platform",
    "Plan": "Semi-Annual",
    "Amount": "Rs 8000.00",
    "StartDate": "20/07/2023",
    "NextRenewal": "20/01/2024",
    "isActive": false
  }
];

// Static entities data
// const entitiesData = [
//     {
//         "id": 1,
//         "DivisionName": "AI Research",
//         "UserName": "GJ5006",
//         "Location": "Jaipur",
//         "CreatedOn": "10/10/2022",
//         "ClosedOn": "12/12/2022",
//         "isActive": true
//     },
//     {
//         "id": 2,
//         "DivisionName": "Cyber Security",
//         "UserName": "MK3021",
//         "Location": "Delhi",
//         "CreatedOn": "05/08/2023",
//         "ClosedOn": "N/A",
//         "isActive": true
//     },
//     {
//         "id": 3,
//         "DivisionName": "Cloud Computing",
//         "UserName": "RT9087",
//         "Location": "Bangalore",
//         "CreatedOn": "20/03/2021",
//         "ClosedOn": "18/07/2023",
//         "isActive": false
//     },
//     {
//         "id": 4,
//         "DivisionName": "Data Analytics",
//         "UserName": "SP6574",
//         "Location": "Hyderabad",
//         "CreatedOn": "15/06/2020",
//         "ClosedOn": "25/09/2022",
//         "isActive": false
//     },
//     {
//         "id": 5,
//         "DivisionName": "IoT Solutions",
//         "UserName": "AK1123",
//         "Location": "Pune",
//         "CreatedOn": "30/11/2023",
//         "ClosedOn": "N/A",
//         "isActive": true
//     }
// ];

const DistributorCNFdetails = ({ }) => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [distributorData, setDistributerData] = useState(null);
  console.log(distributorData, "1111")
  const axiosInstance = useAxios();
  const toast = useToast();
  const [backupData, setBackupData] = useState(null);
  const navigate = useNavigate();
  const [isRetailerProfile] = useState(false);
  const [isdrugLicense] = useState(true);
  const [iswholesaleLicense] = useState(false);
  const [selectedModules, setSelectedModules] = useState([]);
  //  New State for Active/Block toggle
  const [statusLoading, setStatusLoading] = useState(false);
  const [currentStatus, setCurrentStatus] = useState("");
  const [isBillingSame, setIsBillingSame] = useState(false);
  const [tracktype, setTracktype] = useState('');
  const [tempEmail, setTempEmail] = useState("");

  const [plans, setPlans] = useState([]);
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [loadingPlans, setLoadingPlans] = useState(false);
  const [updatingPlan, setUpdatingPlan] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showDropdown, setShowDropdown] = useState(true);
  const { isOpen, onOpen, onClose } = useDisclosure();

  //  pehle yahan define karo
  const defaultAddress = {
    name: "",
    mobile: "",
    email: "",
    webURL: "",
    addLine1: "",
    addLine2: "",
    city: "",
    state: "",
    pinCode: "",
    country: "India",
  };

  // 👇 phir state banaye
  const [businessAddress, setBusinessAddress] = useState(defaultAddress);
  const [billingAddress, setBillingAddress] = useState(defaultAddress);

  // 👇 phir effect lagaye
  useEffect(() => {
    if (distributorData) {
      setBusinessAddress(distributorData.businessAddress || defaultAddress);
      setBillingAddress(distributorData.billingAddress || defaultAddress);
    }
  }, [distributorData]);


  // Bank details state
  // const [bankDatas, setBankDatas] = useState({
  //   accountHolder: "",
  //   bankName: "",
  //   accountNumber: "",
  //   ifsc: ""
  // });



  useEffect(() => {

    const Distributor = distributorData;
    console.log(distributorData, "distributorData");
    if (Distributor?.distributors_details) {
      // setBankDatas({
      //   accountHolder: Distributor?.distributors_details.AccHolderName || "",
      //   bankName: Distributor?.distributors_details.bankName || "",
      //   accountNumber: Distributor?.distributors_details.accountNumber || "",
      //   ifsc: Distributor?.distributors_details.ifsc || Distributor?.distributors_details.IFSC || ""
      // });
    }
  }, [distributorData]);


  useEffect(() => {
    if (distributorData) {
      if (distributorData.businessAddress) {
        console.log('field', distributorData)
        setBusinessAddress({
          ...defaultAddress, // sab default fields pehle
          ...distributorData.businessAddress // API se aaye fields overwrite karega
        });
      }

      if (distributorData.billingAddress) {
        setBillingAddress({
          ...defaultAddress,
          ...distributorData.billingAddress
        });
      }
    }
  }, [distributorData]);

  console.log("Billing Address state:", billingAddress);


  useEffect(() => {
    console.log("Business Address state:", businessAddress);
    console.log("Billing Address state:", billingAddress);
  }, [businessAddress, billingAddress]);

  useEffect(() => {
    const Distributor = distributorData;
    if (Distributor?.distributors_details?.email) {
      setTempEmail(Distributor.distributors_details.email);
    }
  }, [distributorData]);


  // Handler function to update state from child
  // const handleBankChange = (field, value) => {
  //   setBankDatas(prev => ({
  //     ...prev,
  //     [field]: value
  //   }));
  // };

  //  Business Address handler
  const handleBusinessAddressChange = (field, value) => {
    console.log('Hospital9999999999999999999999', field, value)
    setBusinessAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  //  Billing Address handler
  const handleBillingAddressChange = (field, value) => {
    setBillingAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };


  const handleModuleCheck = (moduleName) => {
    setSelectedModules(prev =>
      prev.includes(moduleName)
        ? prev.filter(m => m !== moduleName)
        : [...prev, moduleName]
    );
  };

  useEffect(() => {
    const fetchDistributerData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${Config.DistributorCNFdetails_url}/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })

        setDistributerData(response.data);
        console.log(response.data, "distributorData")
      } catch (err) {
        console.error("Error fetching manufacturer details:", err);
        setError("Failed to load manufacturer data. Please try again later.");
      }
      setLoading(false)
    };

    if (id) {
      fetchDistributerData();
    }
  }, []);

  // useEffect(() => {
  //  const fetchPlans = async() => {
  //   try {
  //     const response = await axiosInstance.get(`${Config.plans_list}`,{
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("authToken")}`
  //       },
  //     });
  //     setPlans(response.data?.apiData || []);
  //     console.log( "myplans.......",plans);
  //   } catch (error) {
  //     console.log("Failed to fetch plans", error);
  //   }
  // }
  //   fetchPlans();
  // },[]);

  // Prepare data for components
  const prepareGeneralDetailsData = () => {
    if (!distributorData) return {};

    const Distributor = distributorData;
    console.log(distributorData, "distributorData");

    return {

      userType: "Distributor",
      companyName: Distributor?.distributors_details?.companyName || "",
      ownerName: Distributor?.distributors_details?.ownerName || "",
      companyType: Distributor?.distributors_details?.companyType || "",
      phone: Distributor?.distributors_details?.phone || "",
      email: Distributor?.distributors_details?.email || "",
      PAN: Distributor?.distributors_details?.PAN || "",
      GST: Distributor?.distributors_details?.GST || "",
      CIN: Distributor?.distributors_details?.CIN || "",
      drugLicense: Distributor?.distributors_details?.drugLicense || "",
      fssaiLicense: Distributor?.distributors_details?.fssaiLicense || "",
      wholesaleLicense: Distributor?.distributors_details?.wholesaleLicense || "",
      totalProducts: Distributor?.distributors_details?.totalProducts || 1,
      totalStocks: Distributor?.distributors_details?.totalStocks || 1,
      accountHolder: Distributor?.distributors_details?.accountHolder || "",
      bankName: Distributor?.distributors_details?.bankName || "",
      accountNumber: Distributor?.distributors_details?.accountNumber || "",
      ifsc: Distributor?.distributors_details?.ifsc || "",
      INVSeries: Distributor?.INVSeries || `INV2025-${Distributor?.startNumber || ""}`,

      //         bankDetails: {
      //   accountHolder: bankDatas.accountHolder || "",
      //   bankName: bankDatas.bankName || "",
      //   accountNumber: bankDatas.accountNumber || "",
      //   ifsc: bankDatas.ifsc || ""
      // }
    };
  };


  const prepareDocumentsData = () => {
    if (!distributorData || !distributorData.distributorsDocuments) return [];

    return distributorData.distributorsDocuments.map(doc => ({
      documentName: doc.documentName || 'N/A',
      imageSize: doc.imageSize || 'N/A', // imageSize agar nahi mil raha toh N/A, ya calculate kar sakte ho
      updatedAt: doc.createdAt
        ? new Date(doc.updatedAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
        : 'N/A',
      "File Size": doc.imageSize || "N/A",
      image: doc.image || null, // download ke liye
      documentName: doc.documentName || "document"
    }));
  };



  const entitiesData = () => {
    if (!distributorData || !distributorData.entityDetails) return [];

    const doc = distributorData.entityDetails;

    return [{
      name: doc.name || 'N/A',
      userName: doc.userName || 'N/A',
      address: doc.address || 'N/A',
      createdAt: doc.createdAt
        ? new Date(doc.createdAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
        : 'N/A',
      deletedAt: doc.deletedAt
        ? new Date(doc.deletedAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        })
        : 'N/A',
      status: doc.status || 'N/A',
    }];
  };



  const prepareAddressesData = () => {
    if (!distributorData) return [{}];
    // const Distributor = distributorData;
    const Distributor = distributorData?.businessAddress || {};
    const Billing = distributorData.billingAddress;
    console.log("Hospital", distributorData)

    // Add sample number here
    // Compute sample number
    // const uniqueSeries = "INV2025-";
    // const startNumber = distributorData.startNumber || "";
    // const sampleNumber = uniqueSeries + startNumber;
    // const INVSeries = sampleNumber;

    const invInitials = distributorData?.invInitials || "INV2025";
    const series = distributorData?.series || "";

    return [{
      name: Distributor?.name,
      mobile: Distributor?.mobile,
      email: Distributor?.email,
      webURL: Distributor?.webURL,
      addLine1: Distributor?.addLine1,
      addLine2: Distributor?.addLine2,
      city: Distributor?.city,
      state: Distributor?.state,
      pinCode: Distributor?.pinCode,

      billingAddressname: Billing?.name,
      billingAddressmobile: Billing?.mobile,
      billingAddressemail: Billing?.email,
      billingAddresswebURL: Billing?.webURL,
      billingAddressaddLine1: Billing?.addLine1,
      billingAddressaddLine2: Billing?.addLine2,
      billingAddresscity: Billing?.city,
      billingAddressState: Billing?.state,
      billingAddresspinCode: Billing?.pinCode,
      // businessAddress: Hospital?.businessAddress,
      // billingAddress: Hospital?.billingAddress

      invInitials,
      series
    }];
  };

  const prepareProductCatalogueData = () => {
    console.log(distributorData?.totalStocks, "tp")
    return {
      totalProducts: distributorData?.totalProducts || 0,
      totalStocks: distributorData?.totalStocks || 0
      
    };
  };
  const prepareModulesData = (distributorData) => {
    console.log("API modules data:", distributorData?.modules);

    const modules = distributorData?.modules?.data[0]?.modules || [];
    console.log("modulesfffffffff:", modules);

    return modules
    // modules.map(({module}) => ({
    //   moduleName: module?.moduleName || "",
    //   moduleCategory: module?.moduleCategory || "N/A",
    //  roleId: distributorData?.roleId || null
    //  roleName: distributorData?.roleName || "",
    //   accessLevel: module?.accessLevel || "N/A",
    //   url: module?.url || "",
    //   icon: module?.icon || "",
    //   subModules: module?.subModules || [],
    //   components: module?.components || [],
    // }));
  };

  const roleName = distributorData?.modules?.data?.[0]?.roleName || null;

  console.log(roleName, "898392892");

  useEffect(() => {
    if (distributorData) {
      setCurrentStatus(distributorData?.distributors_details?.status || "Active");
    }
    //console.log(distributorData.status, "sddssddsdssddssd");

  }, [distributorData]);


  const collectAllModules = (modules = [], roleId, selectedModules = []) => {
    let collected = [];

    modules.forEach(mod => {
      const isChecked = selectedModules.includes(mod.moduleName);


      collected.push({
        moduleConfigId: mod.moduleConfigId,
        roleId,
        accessLevel: isChecked ? "Full" : "None",
        ...(mod.moduleMappingId !== null && { moduleMappingId: mod.moduleMappingId })
      });

      // Recursively check subModules
      if (mod.subModules && mod.subModules.length > 0) {
        collected = collected.concat(
          collectAllModules(mod.subModules, roleId, selectedModules)
        );
      }

      // Recursively check components
      if (mod.components && mod.components.length > 0) {
        collected = collected.concat(
          collectAllModules(mod.components, roleId, selectedModules)
        );
      }
    });

    return collected;
  };

  // const fetchOrgPlans = async (orgId, isRetailer) => {
  //   try {
  //     setLoadingPlans(true);
  //     const res = await axios.get(`${Config.org_plans_list}?isRetailer=${isRetailer}&orgId=${orgId}`, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //       },
  //     });

  //     if (res.data?.status === 200) {
  //       if (!res.data?.show) {
  //         setShowDropdown(false);
  //       }
  //       setPlans(res.data?.apiData);
  //     }
  //   } catch (error) {
  //     console.log("Error fetching plans", error);
  //   } finally {
  //     setLoadingPlans(false);
  //   }
  // };

  // useEffect(() => {
  //   fetchOrgPlans(id, false);
  // }, []);

  // const handleSelectPlan = (e) => {
  //   const selectedId = e.target.value;

  //   setSelectedPlanId(selectedId);

  //   const plan = plans.find((pln) => pln.plan_id === Number(selectedId));

  //   if (!plan) return;

  //   setSelectedPlan(plan);

  //   onOpen();
  // };

  // const updatePlan = async () => {
  //   if (!selectedPlan) return;
  //   try {
  //     setUpdatingPlan(true);

  //     const payLoad = {
  //       "userId": id,
  //       "isRetailer": false,
  //       "planCode": selectedPlan?.code,
  //     };

  //     const res = await axios.post(`${Config.create_org_plan}`, payLoad, {
  //       headers: {
  //         Authorization: `Bearer ${localStorage.getItem("authToken")}`,
  //       }
  //     });

  //     if (res.data?.status === 200 || res.data?.status === 201) {
  //       toast({
  //         title: "Plan Updated",
  //         description: `${selectedPlan.name} updated Successfully`,
  //         status: "success",
  //         duration: 3000,
  //         isClosable: true,
  //         position: "top-right"
  //       });

  //       onClose();
  //       setSelectedPlan(null);

  //       fetchOrgPlans(id, false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast({
  //       title: "Failed",
  //       description: error?.response?.data?.message || "Something went wrong",
  //       status: "error",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "top-right"
  //     });

  //   } finally {
  //     setUpdatingPlan(false);
  //   }
  // };



  // Invoice Info (invInitials + series)
  const prepareInvoiceData = () => ({
    invInitials: distributorData?.distributors_details?.invInitials || "",
    series: distributorData?.distributors_details?.series || "",
  });

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {

    // if (
    //   !String(bankDatas.accountHolder || "").trim() ||
    //   !String(bankDatas.bankName || "").trim() ||
    //   !String(bankDatas.accountNumber || "").trim() ||
    //   !String(bankDatas.ifsc || "").trim()
    // ) {
    //   toast({
    //     title: "Missing Bank Details",
    //     description: "Please fill in all bank details before saving.",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "top-right",
    //   });
    //   return; 
    // }


    if (
      !String(businessAddress.name || "").trim() ||
      !String(businessAddress.mobile || "").trim() ||
      !String(businessAddress.addLine1 || "").trim() ||
      // !String(businessAddress.city || "").trim() ||
      // !String(businessAddress.state || "").trim() ||
      !String(businessAddress.pinCode || "").trim()
    ) {
      toast({
        title: "Missing Business Address",
        description: "Please fill in all required fields for Business Address.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      return;
    }


    // if (
    //   !String(billingAddress.name || "").trim() ||
    //   !String(billingAddress.mobile || "").trim() ||
    //   !String(billingAddress.addLine1 || "").trim() ||
    //   // !String(billingAddress.city || "").trim() ||
    //   // !String(billingAddress.state || "").trim() ||
    //   !String(billingAddress.pinCode || "").trim()
    // ) {
    //   toast({
    //     title: "Missing Billing Address",
    //     description: "Please fill in all required fields for Billing Address.",
    //     status: "error",
    //     duration: 5000,
    //     isClosable: true,
    //     position: "top-right",
    //   });
    //   return;
    // }

    try {
      setSaving(true);

      const invInitials = distributorData?.invInitials ?? "INV2025";
      const series = distributorData?.series ?? "";

      // Prepare full address data to send
      const addressesPayload = {
        businessAddress: {
          name: businessAddress?.name || "",
          mobile: businessAddress?.mobile || "989898",
          email: businessAddress?.email || "",
          webURL: businessAddress?.webURL || "",
          addLine1: businessAddress?.addLine1 || "",
          addLine2: businessAddress?.addLine2 || "",
          city: businessAddress?.city || "",
          state: businessAddress?.state || "",
          country: businessAddress?.country || "India",
          pinCode: businessAddress?.pinCode || "7473873",
        },
        billingAddress: isBillingSame
          ? { ...businessAddress, addressType: "Billing", country: "India" }
          : {
            name: billingAddress?.name || "",
            mobile: billingAddress?.mobile || null,
            email: billingAddress?.email || "",
            webURL: billingAddress?.webURL || "",
            addLine1: billingAddress?.addLine1 || "",
            addLine2: billingAddress?.addLine2 || "",
            city: billingAddress?.city || "",
            state: billingAddress?.state || "",
            country: billingAddress?.country || "India",
            pinCode: billingAddress?.pinCode || "7473873",
          },
        invInitials,
        series
      };


      //  const bankDetails = {
      //   accountHolder: bankDatas.accountHolder || "",
      //   bankName: bankDatas.bankName || "",
      //   accountNumber: bankDatas.accountNumber || "",
      //   ifsc: bankDatas.ifsc || ""
      // };

      const roleId = distributorData?.modules?.data?.[0]?.roleId || null;

      const updatedModules = collectAllModules(
        distributorData?.modules?.data?.[0]?.modules || [],
        roleId,
        selectedModules
      );



      // Include sampleNumber in the payload

      let D = distributorData?.distributors_details

      const payload = {
        ...D,
        email: tempEmail,
        ...addressesPayload,
        invInitials,
        series,
        // AccHolderName: bankDatas.accountHolder,
        //  bankName: bankDatas.bankName,
        //  accountNumber: bankDatas.accountNumber,
        //  IFSC: bankDatas.ifsc,
        // modules: updatedModules
      };



      const response = await axios.put(`${Config.DistributorUpdate_url}/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
      });

      if (response?.status === 200 || response?.status === 201) {
        // setBackupData(distributorData); // refresh backup
        navigate("/distributors");
        toast({
          title: "Profile Updated",
          description: "Profile saved successfully",
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Failed to save profile",
          description: response?.data?.message || "Unexpected server response.",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Save failed:", err);
      toast({
        title: "Save failed",
        description: err?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setSaving(false);
    }
  };



  const handleCancel = () => {
    navigate("/distributors");
  };


  if (loading) {
    return (
      <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px" textAlign="center">
        <Spinner size="xl" color="#5570F1" thickness="4px" />
        <Text mt={4}>Loading Distributor profile...</Text>
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  const handleGeneralChange = (key, value) => {
    if (key === "email") {
      setTempEmail(value);
    } else {
      setDistributerData(prev => ({
        ...prev,
        distributors_details: {
          ...prev.distributors_details,
          [key]: value
        }
      }));
    }
  };

  const handleSubscriptions = () => {
    navigate(`/distributors/DistributorCNFdetails/${id}/SubscriptionsPage`);
  }

  //  Toggle Status Handler
  const handleStatusToggle = async () => {
    try {
      setStatusLoading(true);
      const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

      const response = await axios.put(
        `${Config.Block_Active_url}/${id}`,
        { id, status: newStatus }, // payload
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
        }
      );
      console.log(response.status, "jkjkkjkjkjkk");


      if (response.status === 200 || response.status === 201) {
        setCurrentStatus(newStatus);
        toast({
          title: `Distributor ${newStatus === "Active" ? "Activated" : "Blocked"}`,
          description: `Status changed to ${newStatus === "Active" ? "Active" : "Blocked"}.`,
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        throw new Error("Unexpected server response");
      }
    } catch (err) {
      console.error("Status update failed:", err);
      toast({
        title: "Status Update Failed",
        description: err?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    } finally {
      setStatusLoading(false);
    }
  };


  const handleSendEmail = async () => {
    try {
      const email = distributorData?.distributors_details?.email;
      if (!email) {
        toast({
          title: "Email not found",
          description: "Retailer email is missing",
          status: "warning",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
        return;
      }

      //  Check if type is selected
      // if (!platform) {
      //   toast({
      //     title: "Select Type",
      //     description: "Please select a type before sending email",
      //     status: "warning",
      //     duration: 4000,
      //     isClosable: true,
      //     position: "top-right",
      //   });
      //   return;
      // }

      const response = await axios.post(
        `${Config.SendEmail_url}`,   // replace  API 
        { email, id},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      console.log(response.data, "rerereerererererere")

      if (response?.status === 200 || response?.status === 201) {
        toast({
          title: "Email Sent",
          description: `Email sent successfully to ${email}`,
          status: "success",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      } else {
        toast({
          title: "Failed",
          description: response?.data?.message || "Could not send email",
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-right",
        });
      }
    } catch (err) {
      console.error("Error sending email:", err);
      toast({
        title: "Error",
        description: err?.response?.data?.message || "Something went wrong",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    }
  };

  return (


    <Box backgroundColor='#F0F4F9' height={"100%"}>
      <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
        <LeftSidebar />
        <Box width='80%'>
          <HeaderBar />
          <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">
            <Breadcrumb color="#8B8D97" padding="10px 0px 2rem 0px">
              <BreadcrumbItem>
                <BreadcrumbLink href="/overview"><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink href="/distributors" color="#8B8D97" fontSize="13px">Distributor CNF</BreadcrumbLink>
              </BreadcrumbItem>

              <BreadcrumbItem>
                <BreadcrumbLink href={`/distributors/DistributorCNFdetails/${id}`} color="#8B8D97" fontSize="13px">Profile Details</BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>

            <VStack position={"relative"} align="start" gap={0}>
              <HStack>
                <Text fontSize="24px" color="#0B0C14">
                  Distributor / CNF Profile Details
                </Text>
                <Badge
                  colorScheme="green"
                  variant="solid"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >

                </Badge>
              </HStack>
              <Text fontSize="18px" color="#8C8C91">
                Information for Backend Team to Analyse
              </Text>

              <HStack position={"absolute"} display={"flex"} alignItems={"center"} justifyContent={"center"} top={"0px"} right={"100px"}>
                {/*  New Active/Block Button */}
                <Button
                  onClick={handleStatusToggle}
                  isLoading={statusLoading}
                  px="3rem"
                  py="0.5rem"
                  color="#fff"
                  borderRadius="full"
                  minW="fit-content"
                  bg={currentStatus === "Active" ? "red.500" : "green.500"}
                  _hover={{
                    bg: currentStatus === "Active" ? "red.600" : "green.600",
                  }}
                >
                  {currentStatus === "Active" ? "Block" : "Activate"}
                </Button>

                <Button
                  onClick={handleSendEmail}
                  variant="outline"
                  bg="#3e60aa"
                  color="#fff"
                  px="1.5rem"
                  py="0.5rem"
                  borderRadius="10px"
                  minW="fit-content"
                  _hover={{ bg: "#14204A" }}
                  isDisabled={!tempEmail?.trim()}
                >
                  OnBoard
                </Button>

                {/* {showDropdown && (
                  <Select value={selectedPlanId || ""} onChange={handleSelectPlan} color="#333333" borderRadius="10px" border={"1px solid #706d6dff"} placeholder="Select Subscription">
                    {plans.map((plan) => (
                      <option key={plan.plan_id} value={plan.plan_id}>
                        {plan.name}
                      </option>
                    ))}
                  </Select>
                )} */}

              </HStack>
            </VStack>

            <HStack justifyContent={"space-between"}>
              <ButtonGroup isAttached variant="outline" marginBlock="2rem">
                <Button
                  as="a"
                  href="#general"
                  _hover={{ bg: "#ebedf0" }}
                  color="#0B0C14"
                  fontWeight="400"
                  fontSize="14px"
                  borderColor="rgba(11,12,20,25%)"
                  borderTopLeftRadius="10dvw"
                  borderBottomLeftRadius="10dvw"
                  colorScheme="blue"
                >
                  General
                </Button>
                <Button
                  as="a"
                  href="#invoice"
                  _hover={{ bg: "#ebedf0" }}
                  color="#0B0C14"
                  fontWeight="400"
                  fontSize="14px"
                  borderColor="rgba(11,12,20,25%)"
                  borderTopLeftRadius="10dvw"
                  borderBottomLeftRadius="10dvw"
                  colorScheme="blue"
                >
                  Invoice Service
                </Button>
                <Button
                  as="a"
                  href="#business-address"
                  _hover={{ bg: "#ebedf0" }}
                  color="#0B0C14"
                  fontWeight="400"
                  fontSize="14px"
                  borderColor="rgba(11,12,20,25%)"
                  colorScheme="blue"
                >
                  Business Address
                </Button>
                {/* <Button
                                as="a"
                                href="#bankdata"
                                _hover={{ bg: "#ebedf0" }}
                                color="#0B0C14"
                                fontWeight="400"
                                fontSize="14px"
                                borderColor="rgba(11,12,20,25%)"
                                colorScheme="blue"
                            >
                                Bank Details
                            </Button> */}
                <Button
                  as="a"
                  href="#documents-upload"
                  _hover={{ bg: "#ebedf0" }}
                  color="#0B0C14"
                  fontWeight="400"
                  fontSize="14px"
                  borderColor="rgba(11,12,20,25%)"
                  colorScheme="blue"
                >
                  Documents Upload
                </Button>
                <Button
                  as="a"
                  href="#employee-details"
                  _hover={{ bg: "#ebedf0" }}
                  color="#0B0C14"
                  fontWeight="400"
                  fontSize="14px"
                  borderColor="rgba(11,12,20,25%)"
                  borderTopRightRadius="10dvw"
                  borderBottomRightRadius="10dvw"
                  colorScheme="blue"
                >
                  Employee Details
                </Button>
                {/* <Button
                                as="a"
                                href="#role_details"
                                _hover={{ bg: "#ebedf0" }}
                                color="#0B0C14"
                                fontWeight="400"
                                fontSize="14px"
                                borderColor="rgba(11,12,20,25%)"
                                borderTopRightRadius="10dvw"
                                borderBottomRightRadius="10dvw"
                                colorScheme="blue"
                            >
                                Role Details
                            </Button> */}
              </ButtonGroup>

              <Button
                variant="outline"
                bg="#3e60aa"
                color="#fff"
                _hover={{ bg: "#14204A" }}
                px="1.5rem"
                py="0.5rem"
                marginRight={"6rem"}
                borderRadius="10px"
                minW="fit-content"
                onClick={handleSubscriptions}>
                Subscriptions
              </Button>
            </HStack>

            <div id="general">
              {distributorData && (
                <GeneralDetails
                  GeneralDetailsObj={{ ...prepareGeneralDetailsData(), email: tempEmail }}
                  onChange={handleGeneralChange}
                  isdrugLicense={isdrugLicense}
                  iswholesaleLicense={iswholesaleLicense}
                />
              )}
            </div>

            <div id="invoice">
              <InvoiceSeries
                invoiceData={{
                  invInitials: distributorData?.distributors_details?.invInitials ?? "INV2025",
                  series: distributorData?.distributors_details?.series ?? ""
                }}

                onChange={(key, value) =>
                  setDistributerData(prev => ({
                    ...prev,
                    [key]: value
                  }))
                } />


            </div>

            {/* <SubscriptionsEntities
                            Heading="Subscriptions"
                            SubHeading="Status and Details"
                            TableHeading={TableHeadingSubscription}
                            TableData={subscriptionData}
                        /> */}

            {/* <SubscriptionsEntities
                            Heading="Entities"
                            SubHeading="Divisions Details"
                            TableHeading={TableHeadingEntities}
                            // TableData={...entitiesData()}
                            TableData={entitiesData()}

                        /> */}

            <ProductCatalogue {...prepareProductCatalogueData()} isRetailerProfile={isRetailerProfile} />

            <div id="business-address">
              <Addresses
                {...prepareAddressesData()[0]}
                businessAddress={businessAddress}
                billingAddress={billingAddress}
                onBusinessChange={handleBusinessAddressChange}
                onBillingChange={handleBillingAddressChange}
                isBillingSame={isBillingSame}
                setIsBillingSame={setIsBillingSame}
                setBillingAddress={setBillingAddress}
                setBusinessAddress={setBusinessAddress}
              />

            </div>

            {/* <div id="bankdata">
                    
                          <BankDetails bankDetails={bankDatas} onChange={handleBankChange} />
            
                          </div> */}


            <div id="documents-upload">
              <DocumentsUpload
                Heading="Document Upload"
                SubHeading="Upload Business Documents"
                TableHeading={TableHeadingDocuments}
                TableData={prepareDocumentsData()}
              />
            </div>
            <div id="employee-details">
              {distributorData && (
                <EmployeeDetails employees={distributorData.employees || []} />
              )}
            </div>

            {/* <div id="role_details">
                   {distributorData && (
                          <RoleDetails
                             Heading="Modules"
                             SubHeading="System and General Modules"
                             modules={prepareModulesData(distributorData)} 
                             selectedModules={selectedModules}
                             setSelectedModules={setSelectedModules}
                             handleModuleCheck={handleModuleCheck}
                             roleName={roleName}
                           />
                         )}
                         
                         </div> */}
            {/* Save / Cancel Buttons */}
            <HStack justifyContent="flex-end" spacing={4} mt={6}>
              <Button onClick={handleCancel} variant="outline" bg={'#D4D4D8'} cursor={"pointer"} px="3rem" py="0.5rem" color={'#fff'} borderRadius={"full"} minW={'fit-content'} _hover={{ bg: "#6b6b6dff" }}>
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                isDisabled={saving} // disable while saving
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
          </Box>

          {/* <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay bg={"blackAlpha.500"} />
            <ModalContent borderRadius={"20px"} p={"10px"}>
              <ModalHeader fontSize={"22px"} fontWeight={"500"} color="#1A202C"> Confirm Plan Update</ModalHeader>

              <ModalCloseButton />

              <ModalBody>
                <VStack spacing={4} align={"stretch"}>
                  <Box
                    bg="#F7FAFC"
                    border="1px solid #E2E8F0"
                    borderRadius="16px"
                    p="18px"
                  >
                    <Text
                      fontSize="13px"
                      color="#718096"
                      mb={1}
                    >
                      Selected Plan
                    </Text>

                    <Text
                      fontSize="22px"
                      fontWeight="700"
                      color="#2D3748"
                    >
                      {selectedPlan?.name}
                    </Text>

                    <Text
                      fontSize="16px"
                      fontWeight="600"
                      color="#5570F1"
                      mt={2}
                    >
                      ₹ {selectedPlan?.base_price}
                    </Text>
                  </Box>

                  <Text
                    fontSize="15px"
                    color="#4A5568"
                    lineHeight="24px"
                  >
                    Are you sure you want to update this distributor
                    to the selected plan?
                  </Text>

                </VStack>
              </ModalBody>
              <ModalFooter gap={3}>

                <Button
                  variant="outline"
                  borderRadius="12px"
                  onClick={() => {
                    setSelectedPlan(null);
                    onClose();
                  }}
                >
                  Cancel
                </Button>

                <Button
                  bg="#5570F1"
                  color="#fff"
                  borderRadius="12px"
                  _hover={{ bg: "#4059d6" }}
                  onClick={updatePlan}
                  isLoading={updatingPlan}
                >
                  Confirm Update
                </Button>

              </ModalFooter>
            </ModalContent>
          </Modal> */}
          <Footer />
        </Box>
      </HStack>

    </Box>


  );
};

export default DistributorCNFdetails;