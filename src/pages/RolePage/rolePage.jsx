import React from "react";
import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, ButtonGroup, Text, VStack, Spinner, Alert, AlertIcon, HStack, Badge, useToast, Select, Checkbox } from "@chakra-ui/react";
import RoleDetails from "../../components/ProfileElements/Role Details/RoleDetails";
import { Config } from "../../components/Utils/Config";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import Footer from "../../components/footer";
import { useAuth } from "../../components/Context/authContext";
import axios, { all } from "axios";
import useAxios from "../../components/Context/axiosInstance";
import { GoHomeFill } from "react-icons/go";

export default function RolePage() {

    const { id } = useParams();
    const location = useLocation();
    const [distributorData, setDistributerData] = useState(null);
    const [manufacturerData, setManufacturerData] = useState(null);
    const axiosInstance = useAxios();
    const toast = useToast();
    const navigate = useNavigate();
    const [isRetailerProfile] = useState(false);
    const [selectedModules, setSelectedModules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentStatus, setCurrentStatus] = useState("");

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    let user = "";


    if (location.pathname.includes("distributors")) {
        user = "Distributor";
    }
    else {
        user = "Manufacturer";
    }

    const handleModuleCheck = (moduleName) => {
        setSelectedModules(prev =>
            prev.includes(moduleName)
                ? prev.filter(m => m !== moduleName)
                : [...prev, moduleName]
        );
    };

    useEffect(() => {
        if (user == "Distributor") {
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
                    console.error("Error fetching distributor details:", err);
                    setError("Failed to load manufacturer data. Please try again later.");
                }
                setLoading(false)
            };

            if (id) {
                fetchDistributerData();
            }
        }
        else {
            const fetchDetails = async () => {
                try {
                    const response = await axios.get(
                        `${Config.ManufacturerDetails_url}/${id}`,
                        {
                            headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
                        }
                    );

                    console.log("API response:", response.data);

                    // Merge manufacturer + root level fields
                    const mergedData = {
                        ...response.data.manufacturer,   // includes companyName, bank details, invInitials, series
                        modules: response.data.modules || []
                    };


                    setManufacturerData(mergedData);

                } catch (err) {
                    console.error("Failed to fetch details:", err);

                    if (err.response) {
                        console.error("Error response:", err.response.data);
                    } else if (err.request) {
                        console.error("No response received:", err.request);
                    } else {
                        console.error("Error setting up request:", err.message);
                    }

                    setError("Failed to load details. Please try again later.");
                }
            };

            if (id) {
                fetchDetails();
            }
        }
    }, []);

    const prepareModulesData = () => {
        if (user === "Distributor") {
            return distributorData?.modules?.data?.[0]?.modules || [];
        } else {
            return manufacturerData?.modules?.data?.[0]?.modules || [];
        }
    };



    useEffect(() => {
        if (user == "Distributor") {
            if (distributorData) {
                setCurrentStatus(distributorData?.distributors_details?.status || "Active");
            }
            //console.log(distributorData.status, "sddssddsdssddssd");

        }
        else {
            if (manufacturerData) {
                setCurrentStatus(manufacturerData.status || "Active");
            }
            //  console.log(manufacturerData.status, "sddssddsdssddssd");


        }
    }, [distributorData, manufacturerData]);


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

    const handleCancel = () => {
        if (user === "Distributor") {
            navigate("/distributors");
        }
        else {
            navigate("/manufacturers");
        }
    };

    const roleName = user === "Distributor"
        ? distributorData?.modules?.data?.[0]?.roleName || null
        : manufacturerData?.modules?.data?.[0]?.roleName || null;


    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        try {

            let updatedModules = [];
            let roleId = "";


            setSaving(true);
            if (user == "Distributor") {
                roleId = distributorData?.modules?.data?.[0]?.roleId || null;

                updatedModules = collectAllModules(
                    distributorData?.modules?.data?.[0]?.modules || [],
                    roleId,
                    selectedModules
                );
            }
            else {
                roleId = manufacturerData?.modules?.data?.[0]?.roleId || null;

                updatedModules = collectAllModules(
                    manufacturerData?.modules?.data?.[0]?.modules || [],
                    roleId,
                    selectedModules
                );
            }

            // let payload;
            // let D = distributorData?.distributors_details

            // if (user === "Distributor") {
            //     payload = {
            //         ...D,
            //         modules: updatedModules,
            //     };
            // } else {
            //     payload = {
            //         ...manufacturerData,
            //         modules: updatedModules,
            //     };
            // }
            let payload;

            if (user === "Distributor") {
                
                payload = {
                    modules: updatedModules,
                };
            } else {
                
                payload = {
                    modules: updatedModules,
                };
            }


console.log("Saving Role Payload:", payload);

            console.log("roleId:", roleId);
            console.log("payload ", payload);

            

            const updateUrl =
                user === "Distributor"
                    ? `${Config.update_modules}/${id}`
                    : `${Config.update_modules}/${id}`;

            const response = await axios.put(`${updateUrl}`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }
            });

            console.log("Full API response:", response.data);

            if (response?.status === 200 || response?.status === 201) {
                // setBackupData(distributorData); // refresh backup
                if (user === "Distributor") {
                    navigate("/distributors");
                }
                else {
                    navigate("/manufacturers");
                }
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
    }




    return (
        <>
            <Box backgroundColor="#F0F4F9" height="100%">
                <HStack justifyContent="space-between" px="20px" alignItems="flex-start">
                    <LeftSidebar />
                    <Box width="80%">
                        <HeaderBar />
                        <Box p={4} bg="white" mt="1rem" padding="12px 20px" borderRadius="15px 15px 0px 0px">
                            <Breadcrumb color="#8B8D97" padding="10px 0px 2rem 0px">
                                <BreadcrumbItem>
                                    <BreadcrumbLink href="/overview"><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink href={user === "Distributor" ? "/distributors" : "/manufacturers"} color="#8B8D97" fontSize="13px">{user === "Distributor" ? "Distributor List" : "Manufacturer List"}</BreadcrumbLink>
                                </BreadcrumbItem>

                                <BreadcrumbItem>
                                    <BreadcrumbLink href={user === "Distributor" ? `/distributors/RolePage/${id}` : `/manufacturers/RolePage/${id}`} color="#8B8D97" fontSize="13px">Role Details</BreadcrumbLink>
                                </BreadcrumbItem>
                            </Breadcrumb>
                            {loading ? null : (
                                user === "Distributor" && distributorData?.modules ? (
                                    <RoleDetails

                                        Heading="Modules"
                                        SubHeading="System and General Modules"
                                        modules={prepareModulesData()}
                                        selectedModules={selectedModules}
                                        setSelectedModules={setSelectedModules}
                                        handleModuleCheck={handleModuleCheck}
                                        roleName={roleName}
                                    />
                                ) : user === "Manufacturer" && manufacturerData?.modules ? (
                                    <RoleDetails
                                        Heading="Modules"
                                        SubHeading="System and General Modules"
                                        modules={prepareModulesData()}
                                        selectedModules={selectedModules}
                                        setSelectedModules={setSelectedModules}
                                        handleModuleCheck={handleModuleCheck}
                                        roleName={roleName}
                                    />
                                ) : null
                            )}
                        
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
                    </Box>
                </HStack>
                <Footer />
            </Box>
        </>
    )
}
