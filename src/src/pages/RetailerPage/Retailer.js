import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import RetailerSummary from "../../components/Retailer/RetailerSummary";
import Footer from "../../components/footer";

const Retailer = () => {
    return (
        <>
            <Box backgroundColor='#F0F4F9' height={"100%"}>
                <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                    <LeftSidebar />
                    <Box width='80%'>
                        <HeaderBar />
                        <RetailerSummary />
                    </Box>
                </HStack>
                <Footer />
                
            </Box>
        </>
    )
}

export default Retailer