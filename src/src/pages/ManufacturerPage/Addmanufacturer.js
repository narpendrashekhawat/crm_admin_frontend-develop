import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import ManufacturerForm from "../../components/AddManufacture/Addmanu";

const AddManufacturer = () => {
    return (
        <>
            <Box backgroundColor='#F0F4F9' height={"100vh"}>
                <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                    <LeftSidebar />
                    <Box width='80%'>
                        <HeaderBar />
                        <ManufacturerForm />
                    </Box>
                </HStack>
            </Box>
        </>
    );
};

export default AddManufacturer;