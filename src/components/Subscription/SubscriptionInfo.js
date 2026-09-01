import React from 'react'
import { Box, HStack } from "@chakra-ui/react";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../Header/HeaderBar";
import SubscriptionSummary from "../Subscription/SubscriptionSummary";
const SubscriptionInfo = () => {
  return (
    <>
            <Box backgroundColor='#F0F4F9' height={"100%"}>
                <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                    <LeftSidebar />
                    <Box width='80%'>
                        <HeaderBar />
                        <SubscriptionSummary/>
                    </Box>
                </HStack>
            </Box>
        </>
  )
}

export default SubscriptionInfo;