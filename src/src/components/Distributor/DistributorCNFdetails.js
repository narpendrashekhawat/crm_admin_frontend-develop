import { useState, useEffect } from "react";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, ButtonGroup, Text, VStack, Spinner, Alert, AlertIcon, HStack, Badge } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa"; // Placeholder for email verification icon
import GeneralDetails from "../ProfileElements/GeneralDetails/GeneralDetails";
import SubscriptionsEntities from "../ProfileElements/Subscriptions_Entitites/Subscriptions_Entities";
import ProductCatalogue from "../ProfileElements/ProductCatalogue/ProductCatalogue";
import Addresses from "../ProfileElements/Addresses/Addresses";
import { useParams } from "react-router-dom";
import useAxios from "../Context/axiosInstance";
import DocumentsUpload from "../ProfileElements/DocumentUpload/DocumentUpload";
import { Config } from "../Utils/Config";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../footer";
import Distributor from "../../pages/DistributorPage/Distributor";

const TableHeadingSubscription = ["Subscription", "Plan", "Amount", "Start Date", "Next Renewal", "Status"];
const TableHeadingEntities = ["Division Name", "User Name", "Location", "Created On", "Closed On", "Status"];
const TableHeadingDocuments = ["File Name", "File Details", "Upload date"];

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
const entitiesData = [
    {
        "id": 1,
        "DivisionName": "AI Research",
        "UserName": "GJ5006",
        "Location": "Jaipur",
        "CreatedOn": "10/10/2022",
        "ClosedOn": "12/12/2022",
        "isActive": true
    },
    {
        "id": 2,
        "DivisionName": "Cyber Security",
        "UserName": "MK3021",
        "Location": "Delhi",
        "CreatedOn": "05/08/2023",
        "ClosedOn": "N/A",
        "isActive": true
    },
    {
        "id": 3,
        "DivisionName": "Cloud Computing",
        "UserName": "RT9087",
        "Location": "Bangalore",
        "CreatedOn": "20/03/2021",
        "ClosedOn": "18/07/2023",
        "isActive": false
    },
    {
        "id": 4,
        "DivisionName": "Data Analytics",
        "UserName": "SP6574",
        "Location": "Hyderabad",
        "CreatedOn": "15/06/2020",
        "ClosedOn": "25/09/2022",
        "isActive": false
    },
    {
        "id": 5,
        "DivisionName": "IoT Solutions",
        "UserName": "AK1123",
        "Location": "Pune",
        "CreatedOn": "30/11/2023",
        "ClosedOn": "N/A",
        "isActive": true
    }
];

const DistributorCNFdetails = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [DistributorData, setDistributerData] = useState(null);

    const axiosInstance = useAxios();

    useEffect(() => {
        const fetchDistributerData = async () => {
            try {
                setLoading(true);
                const response = await axiosInstance.get(`${Config.DistributorCNFdetails_url}/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('authToken')}`
                    }
                })

                setDistributerData(response.data.data);
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

    // Prepare data for components
    const prepareGeneralDetailsData = () => {
        if (!DistributorData) return {};

        const { Distributor } = DistributorData;
        return {
            companyName: Distributor?.distributor_details?.companyName,
            companyType: Distributor?.distributor_details?.companyType,
            phone: Distributor?.distributor_details?.phone,
            email: Distributor?.distributor_details?.email,
            PAN: Distributor?.distributor_details?.PAN,
            GST: Distributor?.distributor_details?.GST,
            CIN: Distributor?.distributor_details?.CIN,
            drugLicense: Distributor?.distributor_details?.drugLicense,
            fssaiLicense: Distributor?.distributor_details?.fssaiLicense,
            wholesaleLicense: Distributor?.distributor_details?.wholesaleLicense,
            totalProducts: Distributor?.distributor_details?.totalProducts,
            totalStocks: Distributor?.distributor_details?.totalStocks,

        };
    };

    // Use static document data 
    const prepareDocumentsData = () => {
        return documentsData;
    };

    const prepareAddressesData = () => {
        if (!DistributorData) return [{}];

        return [{
            businessAddress: DistributorData.businessAddress,
            billingAddress: DistributorData.billingAddress
        }];
    };

    const prepareProductCatalogueData = () => {
        return {
            totalProducts: DistributorData?.totalProducts || 0,
            totalStocks: DistributorData?.totalStocks || 0
        };
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

    return (


        <Box backgroundColor='#F0F4F9' height={"100%"}>
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                <LeftSidebar />
                <Box width='80%'>
                    <HeaderBar />

                    <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">
                        <Breadcrumb color="#8B8D97" padding="10px 0px 2rem 0px">
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/profile"><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbItem>
                                <BreadcrumbLink href="/manufacturers" color="#8B8D97" fontSize="13px">Distributor CNF</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/manufacturers/profile/${id}`} color="#8B8D97" fontSize="13px">Profile Details</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>

                        <VStack align="start" gap={0}>
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
                                Information for Backend Team to Analyse"
                            </Text>
                        </VStack>

                        <ButtonGroup isAttached variant="outline" marginBlock="2rem">
                            <Button
                                as="a"
                                href="#general"
                                _hover={{ bg: "#ebedf0" }}
                                color="#0B0C14"
                                fontWeight="400"
                                fontSize="14px"
                                borderColor="rgba(11,12,20,25%)"
                                background="rgba(240,241,247,50%)"
                                borderTopLeftRadius="10dvw"
                                borderBottomLeftRadius="10dvw"
                                colorScheme="blue"
                            >
                                General
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
                            <Button
                                as="a"
                                href="#documents-upload"
                                _hover={{ bg: "#ebedf0" }}
                                color="#0B0C14"
                                fontWeight="400"
                                fontSize="14px"
                                borderColor="rgba(11,12,20,25%)"
                                borderTopRightRadius="10dvw"
                                borderBottomRightRadius="10dvw"
                                colorScheme="blue"
                            >
                                Documents Upload
                            </Button>
                        </ButtonGroup>

                        <div id="general">
                            <GeneralDetails {...prepareGeneralDetailsData()} />
                        </div>

                        <SubscriptionsEntities
                            Heading="Subscriptions"
                            SubHeading="Status and Details"
                            TableHeading={TableHeadingSubscription}
                            TableData={subscriptionData}
                        />

                        <SubscriptionsEntities
                            Heading="Entities"
                            SubHeading="Divisions Details"
                            TableHeading={TableHeadingEntities}
                            TableData={entitiesData}
                        />

                        <ProductCatalogue {...prepareProductCatalogueData()} />

                        <div id="business-address">
                            <Addresses {...prepareAddressesData()[0]} />
                        </div>

                        <div id="documents-upload">
                            <DocumentsUpload
                                Heading="Document Upload"
                                SubHeading="Upload Business Documents"
                                TableHeading={TableHeadingDocuments}
                                TableData={prepareDocumentsData()}
                            />
                        </div>
                    </Box>
                    <Footer />
                </Box>
            </HStack>

        </Box>


    );
};

export default DistributorCNFdetails;