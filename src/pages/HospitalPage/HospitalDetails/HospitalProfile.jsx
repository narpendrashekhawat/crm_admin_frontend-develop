import { useState, useEffect } from "react";
import {
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Image, HStack,
  Input,
  Checkbox, Button, Select, InputGroup,
  SimpleGrid
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import fileIcon from "../../../assets/icons/document_upload.svg"
import editIcon from "../../../assets/icons/edit_pfp.svg"
import useAxios from "../../../components/Context/axiosInstance";
import { Config } from "../../../components/Utils/Config";
import verified_icon from "../../../assets/icons/verified_icon.svg"
import profilePic from "../../../assets/images/profile.svg"
import calendarIcon from "../../../assets/icons/document_date.svg"
import SubscriptionsEntities from "../../../components/ProfileElements/Subscriptions_Entitites/Subscriptions_Entities";
// import GeneralDetails from "../../../components/ProfileElements/GeneralDetails/GeneralDetails";
function HospitalProfile() {

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [DistributorData, setDistributerData] = useState(null);
  const [hospitalData, setHospitalData] = useState(null);
  console.log(hospitalData, "1111")

  const TableHeadingEmployee = ["Name", "Role", "Email", "Phone", "Last Login", "Status"];

  const axiosInstance = useAxios();

  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${Config.Get_Hospitals_Details}?hospitalId=${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        })
        console.log(localStorage.getItem('authToken'));

        setHospitalData(response.data.data);
        console.log(hospitalData, "hospitalData")
      } catch (err) {
        console.error("Error fetching hospital details:", err);
        setError("Failed to load hospital data. Please try again later.");
      }
      setLoading(false)
    };

    if (id) {
      fetchHospitalData();
    }
  }, []);

  const TableHeadingSubscription = ["Subscription", "Plan", "Amount", "Start Date", "Next Renewal", "Status"];
  const TableHeadingEntities = ["Division Name", "User Name", "Location", "Created On", "Closed On", "Status"];

  const TableHeadingDocuments = ["documentName", "imageSize", "updatedAt"];

  // const prepareDocumentsData = () => {
  //   return documentsData;
  // };

  const hospitalDocumentData = () => {
    if (!hospitalData || !hospitalData.documents) return [];

    const result = [];
    hospitalData.documents.forEach(doc => {
      (doc.documnets || []).forEach(innerDoc => {  // Changed from doc.documnets to doc.documents
        result.push({
          documentName: doc.documentName || 'N/A',
          imageSize: innerDoc?.imageSize || 'N/A',
          updatedAt: innerDoc?.updatedAt
            ? new Date(innerDoc.updatedAt).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
            : 'N/A',
        });
      });
    });
    return result;
  };



  const prepareGeneralDetailsData = () => {
    if (!hospitalData) return {};

    const Hospital = hospitalData;
    // console.log(Hospital, 'GeneralDetailsObj Hos')

    return {
      name: Hospital?.hospitalName,
      type: Hospital?.type,
      phone: Hospital?.phone,
      pinCode: Hospital?.pinCode,
      email: Hospital?.email,
      address: Hospital?.address,
      city: Hospital?.city,
      state: Hospital?.state,
      // PAN: Hospital?.distributor_details?.PAN,
      GST: Hospital?.GST,
      // CIN: Hospital?.distributor_details?.CIN,
      license: Hospital?.license,
      // fssaiLicense: Hospital?.distributor_details?.fssaiLicense,
      // wholesaleLicense: Hospital?.distributor_details?.wholesaleLicense,
      // totalProducts: Hospital?.distributor_details?.totalProducts,
      // totalStocks: Hospital?.distributor_details?.totalStocks,

    };
  };
  const employeeMockData = [
    { Name: "Dr. Anil Sharma", Role: "Admin", Email: "anil@hospital.com", Phone: "9876543210", LastLogin: "14 Nov, 2025", Status: "Active" },
    { Name: "Priya Singh", Role: "Staff", Email: "priya@hospital.com", Phone: "9998887776", LastLogin: "12 Nov, 2025", Status: "Inactive" },
    { Name: "Sanjay Kumar", Role: "Staff", Email: "sanjay@hospital.com", Phone: "9123456789", LastLogin: "13 Nov, 2025", Status: "Active" },
];

// Data preparation function (around Line 140)
const prepareEmployeeDetailsData = () => {
    return employeeMockData.map(item => ({
        Name: item.Name,
        Role: item.Role,
        Email: item.Email,
        Phone: item.Phone,
        LastLogin: item.LastLogin,
        Status: item.Status
    }));
};

  const prepareAddressesData = () => {
    // if (!DistributorData) return [{}];
    if (!hospitalData) return {};

    const Hospital = hospitalData.businessAddress;
    const Billing = hospitalData.billingAddress;
    console.log(Hospital, 'address Hospital')

    return [{
      name: Hospital?.name,
      mobile: Hospital?.mobile,
      email: Hospital?.email,
      webURL: Hospital?.webURL,
      addLine1: Hospital?.addLine1,
      addLine2: Hospital?.addLine2,
      city: Hospital?.city,
      State: Hospital?.State,
      pinCode: Hospital?.pinCode,

      billingAddressname: Billing?.name,
      billingAddressmobile: Billing?.mobile,
      billingAddressemail: Billing?.email,
      billingAddresswebURL: Billing?.webURL,
      billingAddressaddLine1: Billing?.addLine1,
      billingAddressaddLine2: Billing?.addLine2,
      billingAddresscity: Billing?.city,
      billingAddressState: Billing?.State,
      billingAddresspinCode: Billing?.pinCode,
      // businessAddress: Hospital?.businessAddress,
      // billingAddress: Hospital?.billingAddress
    }];
  };

  const prepareProductCatalogueData = () => {
    return {
      totalProducts: DistributorData?.totalProducts || 0,
      totalStocks: DistributorData?.totalStocks || 0
    };
  };
  return (
    <VStack w={'100%'} align={'start'}>
      <GeneralDetails {...(prepareGeneralDetailsData())} />
      <Addresses {...prepareAddressesData()[0]} />
      <HospitalDocumentsUpload
        Heading="Document Upload"
        SubHeading="Upload Business Documents"
        TableHeading={TableHeadingDocuments}
        TableData={hospitalDocumentData()}
      />
      {/* 👇 ADD EMPLOYEE DETAILS TABLE HERE */}
    <HospitalEmployeeDetails
    Heading="Employee Details"
    SubHeading="List of active staff members"
    TableHeading={TableHeadingEmployee}
    TableData={prepareEmployeeDetailsData()}
/>
      {/* <HospitalSubscriptionsEntities
        Heading="Subscriptions"
        SubHeading="Status and Details"
        TableHeading={TableHeadingSubscription}
        TableData={subscriptionData}
      /> */}
    </VStack>
  )
}


const Addresses = (AddressObj) => {
  const InputStyle = {
    padding: "12px 15px",
    _placeholder: { color: "black" },
    color: "black",
    borderRadius: "12px",
    width: "100%",
    height: "48px",
    boxShadow: "0px 1px 2px rgba(0,0,0,5%)",
    border: "none",
    iconcolor: "#8B8D97"
  };

  const [isBillingSame, setIsBillingSame] = useState(false);

  const billingTextColor = isBillingSame ? "#8C8C91" : "#0B0C14";

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
                  <Text fontSize="14px" color="#8C8C91">Contact Person Name</Text>
                  <Input sx={InputStyle} placeholder={AddressObj.name ?? "name"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color="#8C8C91">Contact Person No.</Text>
                  <Input sx={InputStyle} placeholder={AddressObj.mobile ?? "mobile"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color="#8C8C91">Email Id<sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.email ?? "email"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color="#8C8C91">Website Address</Text>
                  <Input sx={InputStyle} placeholder={AddressObj.webURL ?? "Website URL"} />
                </VStack>
              </HStack>

              <HStack width="100%">
                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                  <Text fontSize="14px" color="#8C8C91">Address Line 1 <sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.addLine1 ?? "Enter Address"} />
                </VStack>

                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                  <Text fontSize="14px" color="#8C8C91">Address Line 2</Text>
                  <Input sx={InputStyle} placeholder={AddressObj.addLine2 ?? "Enter Address"} />
                </VStack>
              </HStack>

              <HStack>
                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color="#8C8C91">Select City<sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.city ?? " city"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color="#8C8C91">Select State<sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.State ?? "State"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color="#8C8C91">PinCode<sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.pinCode ?? "pinCode"} />
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
              <Checkbox onChange={(e) => setIsBillingSame(e.target.checked)} />
            </HStack>
          </VStack>

          <HStack ml="9.5rem">
            <VStack flexWrap="wrap" gap="1.25rem" align="start">
              <HStack>
                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>Contact Person Name</Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddressname ?? "Name"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>Contact Person No.</Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddressmobile ?? "Number"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>Email Id<sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddressemail ?? "Email"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>Website Address</Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddresswebURL ?? "Website URL"} />
                </VStack>
              </HStack>

              <HStack width="100%">
                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>Address Line 1 <sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddressaddLine1 ?? "Enter Address"} />
                </VStack>

                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>Address Line 2</Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddressaddLine2 ?? "Enter Address"} />
                </VStack>
              </HStack>

              <HStack>
                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>Select City<sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddresscity ?? "Enter City"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>Select State<sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddressState ?? "State"} />
                </VStack>

                <VStack align="start" mr="0.45rem">
                  <Text fontSize="14px" color={billingTextColor}>PinCode<sup>*</sup></Text>
                  <Input sx={InputStyle} placeholder={AddressObj.billingAddresspinCode ?? "Pin"} />
                </VStack>
              </HStack>
            </VStack>
          </HStack>
        </VStack>
      </HStack>


    </VStack>
  );
};

const HospitalDocumentsUpload = ({ Heading, SubHeading, TableHeading, TableData }) => {
  return (
    <HStack height={"500px"} align={"start"} >
      <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
        <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
        <Box width="1px" height="full" backgroundColor="#DCDCDE" />
      </VStack>
      <VStack paddingBottom={"5rem"} id='documents-upload' align={"start"} w="full" marginTop={"2rem"}>
        {/* Heading & Subheading */}
        <VStack align={"start"} gap={0} marginBottom={"1rem"}>
          <Text fontSize={"18px"} color={"#0B0C14"}>{Heading}</Text>
          <Text fontSize={"16px"} color={"#8C8C91"}>{SubHeading}</Text>
        </VStack>

        {/* Table with Fixed Header and Scrollable Body */}
        <VStack align={"start"} width={"100%"}>
          <Box w="840px" borderRadius="8px" border={"1px solid #D0D5DD"}>
            {/* Header Section */}
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {TableHeading.map((item, index) => (
                      <Th
                        textTransform={"capitalize"}
                        fontSize={"14px"}
                        fontFamily={"Albert Sans"}
                        key={index}
                        color="white"
                        w={"315px"}
                        background={"#364261"}
                        height={"46px"}
                        borderTopLeftRadius={index === 0 ? "8px" : "0"}
                        borderTopRightRadius={index === TableHeading.length - 1 ? "8px" : "0"}
                      >
                        {item}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
              </Table>
            </TableContainer>

            {/* Scrollable Table Body */}
            <Box scrollBehavior={"smooth"}>
              <TableContainer>
                <Table variant="simple">
                  <Tbody>
                    {TableData?.length > 0 ? (
                      TableData.map((item, index) => (
                        <Tr key={index}>
                          {TableHeading.map((heading, i) => {
                            const key = Object.keys(item).find(k =>
                              k.toLowerCase().replace(/\s/g, '') === heading.toLowerCase().replace(/\s/g, '')
                            );
                            // const key = TableHeading[heading] || "";

                            return (
                              <Td textTransform={"capitalize"}
                                fontSize={"14px"}
                                w={"315px"}
                                fontFamily={"Albert Sans"}
                                key={i}
                              >
                                {/* Use custom images based on column type */}
                                {heading.toLowerCase().includes("file details") ? (
                                  item[key] !== "Pending Document" ? ( // Check if the value is NOT "Pending Document"
                                    <HStack>
                                      <Image src={fileIcon} alt="File Icon" boxSize="16px" />
                                      <Text>{item[key]}</Text>
                                    </HStack>
                                  ) : (
                                    <Text>{item[key]}</Text> // Show only text when it's "Pending Document"
                                  )
                                ) : heading.toLowerCase().includes("upload date") ? (
                                  <HStack>
                                    <Image src={calendarIcon} alt="Calendar Icon" boxSize="16px" />
                                    <Text>{item[key]}</Text>
                                  </HStack>
                                ) : (
                                  item[key]
                                )}

                              </Td>
                            );
                          })}
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={TableHeading.length} textAlign="center">
                          No data available
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </VStack>
      </VStack>
    </HStack>
  );
}

const GeneralDetails = (GeneralDetailsObj) => {
  console.log(GeneralDetailsObj, 'GeneralDetailsObj')
  const InputStyle = {
    padding: "12px 15px",
    _placeholder: { color: "black" },
    color: "black",
    borderRadius: "12px",
    width: "100%",
    height: "48px",
    boxShadow: "0px 1px 2px rgba(0,0,0,5%)",
    border: "none",
    iconcolor: "#8B8D97"
  };
  return (
    <HStack align="start" spacing="2rem" wrap="wrap">
      <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
        <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
        <Box width="1px" height="full" backgroundColor="#DCDCDE" />

      </VStack>

      {/* Left Profile Photo + Text */}
      <VStack align="center" minW="120px">

        <VStack>
          <Text fontSize="18px" color="#0B0C14">Profile</Text>

          <Text fontSize="16px" color="#8C8C91">General Details</Text>
        </VStack>
        <Box position="relative" width="95px" height="95px">

          <Image
            src={profilePic}
            boxSize="95px"
            borderRadius="full"
            border="3px solid white"
            boxShadow="xs"
            objectFit="contain"
          />
          <Button
            position="absolute"
            bottom="0"
            left="50%"
            transform="translate(-50%, 50%)"
            borderRadius="full"
            size="sm"
            bg="white"
            border="2px solid rgba(11,12,20,25%)"
            p={1}
          >
            <Image src={editIcon} boxSize="15px" />
          </Button>
        </Box>
        <Text fontSize="10px" mt="10px" color="#8C8C91" fontWeight="400">
          Hospital Logo
        </Text>
      </VStack>

      {/* Right Form Fields */}
      <VStack align="start" flex="1" spacing="1rem">


        <SimpleGrid columns={[1, 2, 3, 4]} spacing="1rem" width="100%">
          {/* Hospital Name */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">Hospital Name<sup>*</sup></Text>
            <Input
              placeholder="Hospital Name"
              readOnly
              value={GeneralDetailsObj?.name}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            />
          </VStack>

          {/* Type of Hospital */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">Type of Hospital<sup>*</sup></Text>
            <Select
              value={GeneralDetailsObj?.type}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            >
              <option value="partnership_firm">Partnership Firm</option>
            </Select>
          </VStack>

          {/* Email */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">Email Address<sup>*</sup></Text>
            <Input
              type="email"
              placeholder="Email Address"
              value={GeneralDetailsObj?.email}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            />
          </VStack>

          {/* Phone */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">Phone Number<sup>*</sup></Text>
            <Input
              type="tel"
              placeholder="Phone Number"
              value={GeneralDetailsObj?.phone}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            />
          </VStack>

          {/* GST */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">GST Number<sup>*</sup></Text>
            <Input
              placeholder="GST Number"
              value={GeneralDetailsObj?.GST}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            />
          </VStack>

          {/* Address */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">Address<sup>*</sup></Text>
            <Input
              placeholder="Address"
              value={GeneralDetailsObj?.address}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            />
          </VStack>

          {/* City */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">City<sup>*</sup></Text>
            <Select
              value={GeneralDetailsObj?.city}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            >
              <option value="Jaipur">Jaipur</option>
              <option value="Jodhpur">Jodhpur</option>
            </Select>
          </VStack>

          {/* PinCode */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">Pin Code<sup>*</sup></Text>
            <Input
              placeholder="Pin Code"
              value={GeneralDetailsObj?.pinCode}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            />
          </VStack>

          {/* License */}
          <VStack align="start" spacing="2px">
            <Text fontSize="14px" color="#8C8C91">License<sup>*</sup></Text>
            <Input
              placeholder="License"
              value={GeneralDetailsObj?.license}
              onChange={(e) => console.log(e.target.value)}  // Replace with your handler
              sx={InputStyle}
            />
          </VStack>
        </SimpleGrid>
      </VStack>
    </HStack>


  )
}




// --- NEW COMPONENT: HospitalEmployeeDetails (Insert around Line 635) ---

const HospitalEmployeeDetails = ({ Heading, SubHeading, TableHeading, TableData }) => {
    return (
      <HStack height={"auto"} minH="300px" align={"start"} > 
        {/* Vertical Timeline Icon/Separator */}
        <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
          <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
          <Box width="1px" height="full" backgroundColor="#DCDCDE" />
        </VStack>

        <VStack paddingBottom={"5rem"} id='employee-details' align={"start"} w="full" marginTop={"2rem"}>
          {/* Heading & Subheading */}
          <VStack align={"start"} gap={0} marginBottom={"1rem"}>
            <Text fontSize={"18px"} color={"#0B0C14"}>{Heading}</Text>
            <Text fontSize={"16px"} color={"#8C8C91"}>{SubHeading}</Text>
          </VStack>
  
          {/* Table Container */}
          <VStack align={"start"} width={"100%"}>
            <Box w="840px" borderRadius="8px" border={"1px solid #D0D5DD"}>
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      {TableHeading.map((item, index) => (
                        <Th
                          textTransform={"capitalize"}
                          fontSize={"14px"}
                          fontFamily={"Albert Sans"}
                          key={index}
                          color="white"
                          w={"auto"} 
                          background={"#364261"}
                          height={"46px"}
                          borderTopLeftRadius={index === 0 ? "8px" : "0"}
                          borderTopRightRadius={index === TableHeading.length - 1 ? "8px" : "0"}
                        >
                          {item}
                        </Th>
                      ))}
                    </Tr>
                  </Thead>
                </Table>
              </TableContainer>
  
              {/* Scrollable Table Body */}
              <Box maxH="300px" scrollBehavior={"smooth"} overflowY="auto">
                <TableContainer>
                  <Table variant="simple">
                    <Tbody>
                      {TableData?.length > 0 ? (
                        TableData.map((item, index) => (
                          <Tr key={index}>
                            {TableHeading.map((heading, i) => {
                              const key = Object.keys(item).find(k =>
                                k.toLowerCase().replace(/\s/g, '') === heading.toLowerCase().replace(/\s/g, '')
                              );
                              let content = key ? item[key] : "N/A";
                              let cellColor = "#364261";
                              
                              if (heading.toLowerCase() === "status") {
                                cellColor = content === "Active" ? "green.500" : "red.500";
                              } 
  
                              return (
                                <Td 
                                  textTransform={"capitalize"}
                                  fontSize={"14px"}
                                  fontFamily={"Albert Sans"}
                                  color={cellColor}
                                  key={i}
                                  w={"auto"}
                                >
                                  {content}
                                </Td>
                              );
                            })}
                          </Tr>
                        ))
                      ) : (
                        <Tr>
                          <Td colSpan={TableHeading.length} textAlign="center">
                            No employee data available
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          </VStack>
        </VStack>
      </HStack>
    );
  }

const HospitalSubscriptionsEntities = ({ Heading, SubHeading, TableHeading, TableData }) => {
  return (

    <HStack height={"445px"} align={"start"}>
      <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
        <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
        <Box width="1px" height="full" backgroundColor="#DCDCDE" />
      </VStack>
      <VStack align={"start"} w="full" marginTop={"2rem"}>
        {/* Heading & Subheading */}
        <VStack align={"start"} gap={0} marginBottom={"1rem"}>
          <Text fontSize={"18px"} color={"#0B0C14"}>{Heading}</Text>
          <Text fontSize={"16px"} color={"#8C8C91"}>{SubHeading}</Text>
        </VStack>
        
        {/* Table with Fixed Header and Scrollable Body */}
        <VStack align={"start"} marginLeft={"4.5rem"} width={"100%"} overflow={'auto'}>
          <Box minWidth="840px" borderRadius="8px" border={"1px solid #D0D5DD"}>
            {/* Header Section (Separate from Scrollable Body) */}
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    {TableHeading.map((item, index) => (
                      <Th
                        textTransform={"capitalize"}
                        fontSize={"14px"}
                        fontFamily={"Albert Sans"}
                        key={index}
                        color="white"
                        background={"#364261"}
                        height={"46px"}
                        borderTopLeftRadius={index === 0 ? "8px" : "0"}
                        borderTopRightRadius={index === TableHeading.length - 1 ? "8px" : "0"}
                      >
                        {item}
                      </Th>
                    ))}
                  </Tr>
                </Thead>
              </Table>
            </TableContainer>

            {/* Scrollable Table Body */}
            <Box maxH="214px" scrollBehavior={"smooth"} overflowY="auto">
              <TableContainer>
                <Table variant="simple">
                  <Tbody>
                    {TableData.length > 0 ? (
                      TableData.map((item, index) => (
                        <Tr key={index}>
                          {TableHeading.map((heading, i) => {
                            const key = Object.keys(item).find(k =>
                              k.toLowerCase().replace(/\s/g, '') === heading.toLowerCase().replace(/\s/g, '')
                            );

                            // Style for "Status" column
                            if (heading.toLowerCase() === "status") {
                              return (
                                <Td textTransform={"capitalize"}
                                  fontSize={"14px"}
                                  fontFamily={"Albert Sans"}
                                  key={i} color={item[key] === "Active" ? "green.500" : "green.500"} >
                                  {key ? item[key] : "Active"}
                                </Td>
                              );
                            }

                            return <Td textTransform={"capitalize"}
                              fontSize={"14px"}
                              fontFamily={"Albert Sans"}
                              color={"#364261"} key={i}>{key ? item[key] : "Active"}</Td>;
                          })}
                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={TableHeading.length} textAlign="center">
                          No data available
                        </Td>
                      </Tr>
                    )}
                  </Tbody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        </VStack>
      </VStack>
    </HStack>
  );
};

export default HospitalProfile