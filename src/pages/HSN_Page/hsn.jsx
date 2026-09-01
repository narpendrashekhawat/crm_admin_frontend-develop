import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import LeftSidebar from "../../components/LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../../components/Header/HeaderBar";
import HSN_List from "../../components/HSN_Code/HSN_List";

const HSN = () => {
    return (
        <>
            <Box backgroundColor='#F0F4F9' height={"100vh"}>
                <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                    <LeftSidebar />
                    <Box width='80%'>
                        <HeaderBar />
                        <HSN_List />
                    </Box>
                </HStack>
            </Box>
        </>
    );
};

export default HSN;