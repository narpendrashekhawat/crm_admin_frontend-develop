import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import ManufacturerInfo from "../../components/ManufacturerItems/ManufacturerItemsInfo";
import Footer from "../../components/footer";

const ManufacturerList = () => {
    
    return (
        <>
            <Box backgroundColor='#F0F4F9' height={"100%"}>
                <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                    <LeftSidebar />
                    <Box width='80%'>
                        <HeaderBar />
                        <ManufacturerInfo />
                        <Footer />
                    </Box>
                </HStack>
            </Box>
        </>
    )
}

export default ManufacturerList;