import { useState, useEffect } from "react";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, ButtonGroup, Text, VStack, Spinner, Alert, AlertIcon, HStack, Badge } from "@chakra-ui/react";
import { GoHomeFill } from "react-icons/go";
import { FaCheckCircle } from "react-icons/fa"; // Placeholder for email verification icon
import GeneralDetails from "../../components/ProfileElements/GeneralDetails/GeneralDetails";
import SubscriptionsEntities from "../../components/ProfileElements/Subscriptions_Entitites/Subscriptions_Entities";
import ProductCatalogue from "../../components/ProfileElements/ProductCatalogue/ProductCatalogue";
import Addresses from "../../components/ProfileElements/Addresses/Addresses";
import { useParams } from "react-router-dom";
import useAxios from "../../components/Context/axiosInstance";
import DocumentsUpload from "../../components/ProfileElements/DocumentUpload/DocumentUpload";
import { Config } from "../../components/Utils/Config";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../../components/footer";
import Distributor from "../../pages/DistributorPage/Distributor";
import HospitalProfile from "./HospitalDetails/HospitalProfile";


export default function HospitalDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [DistributorData, setDistributerData] = useState(null);
    const [hospitalData, setHospitalData] = useState(null);
    // console.log(hospitalData,"1111")

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

    // useEffect(() => {
    //     const updateHospitalData = async () => {
    //         try {
    //             setLoading(true);
    //             const response = await axiosInstance.get(`${Config.Update_Hospital}?hospitalId=${id}`, {
    //                 headers: {
    //                     Authorization: `Bearer ${localStorage.getItem('authToken')}`
    //                 }
    //             })

    //             setHospitalData(response.data.data);
    //             console.log(hospitalData,"hospitalData")
    //         } catch (err) {
    //             console.error("Error fetching hospital details:", err);
    //             setError("Failed to load hospital data. Please try again later.");
    //         }
    //         setLoading(false)
    //     };

    //     if (id) {
    //         updateHospitalData();
    //     }
    // }, []);

    // Prepare data for components
    const prepareGeneralDetailsData = () => {
        if (!hospitalData) return {};

        const { Hospital } = hospitalData;
        return {
            companyName: Hospital?.hospitalName,
            companyType: Hospital?.distributor_details?.companyType,
            phone: Hospital?.distributor_details?.phone,
            email: Hospital?.distributor_details?.email,
            PAN: Hospital?.distributor_details?.PAN,
            GST: Hospital?.distributor_details?.GST,
            CIN: Hospital?.distributor_details?.CIN,
            drugLicense: Hospital?.distributor_details?.drugLicense,
            fssaiLicense: Hospital?.distributor_details?.fssaiLicense,
            wholesaleLicense: Hospital?.distributor_details?.wholesaleLicense,
            totalProducts: Hospital?.distributor_details?.totalProducts,
            totalStocks: Hospital?.distributor_details?.totalStocks,

        };
    };

    // Use static document data 


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
                                <BreadcrumbLink href="/overview"><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbItem>
                                <BreadcrumbLink href="/hospitals" color="#8B8D97" fontSize="13px">Hospitals</BreadcrumbLink>
                            </BreadcrumbItem>

                            <BreadcrumbItem>
                                <BreadcrumbLink href={`/hospitals/HospitalsDetails/${id}`} color="#8B8D97" fontSize="13px">Profile Details</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>

                        <VStack align="start" gap={0}>
                            <HStack>
                                <Text fontSize="24px" color="#0B0C14">
                                    Hospital
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

                        <HospitalProfile />
                        {/* <div id="general">
                            <GeneralDetails {...prepareGeneralDetailsData()} />
                        </div> */}

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
                            TableData={entitiesData}
                        /> */}

                        {/* <ProductCatalogue {...prepareProductCatalogueData()} /> */}

                        {/* <div id="business-address">
                            <Addresses {...prepareAddressesData()[0]} />
                            
                        </div> */}

                        {/* <div id="documents-upload">
                            <DocumentsUpload
                                Heading="Document Upload"
                                SubHeading="Upload Business Documents"
                                TableHeading={TableHeadingDocuments}
                                TableData={prepareDocumentsData()}
                            />
                        </div> */}
                    </Box>
                    <Footer />
                </Box>
            </HStack>

        </Box>


    );
}
