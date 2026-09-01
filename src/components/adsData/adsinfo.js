import React from 'react'
import { Box, HStack } from "@chakra-ui/react";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import AdsList from "../adsData/adsList";
import HeaderBar from "../Header/HeaderBar";

const Adsinfo = () => {
  return (
    <>
            <Box backgroundColor='#F0F4F9' height={"100%"}>
                <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                    <LeftSidebar />
                    <Box width='80%'>
                        <HeaderBar />
                      <AdsList/>
                    </Box>
                </HStack>
            </Box>
        </>
  )
}

export default Adsinfo;