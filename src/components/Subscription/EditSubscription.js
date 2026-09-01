import React from 'react'
import {
    Box, Input, Button, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Select, Text, Flex,
    HStack, VStack, useDisclosure, Modal, ModalOverlay, ModalContent,
    ModalBody, useToast, FormControl, FormLabel, FormErrorMessage,
} from "@chakra-ui/react";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../Header/HeaderBar";
import { GoHomeFill } from "react-icons/go";
import Footer from "../footer";

const EditSubscription = () => {
  return (
    <Box backgroundColor='#F0F4F9' height={"100%"}>
            <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                <LeftSidebar />
                <Box width='80%'>
                    <HeaderBar />
                    <Box p={4} bg="white" mt='1rem' padding='12px 20px'>
                        <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px'>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/overview'><GoHomeFill color="#5570F1" /></BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/Subscriptions-status' color='#8B8D97' fontSize='13px'>Subscription List </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbItem>
                                <BreadcrumbLink href='/Subscriptions-status/edit-Subscription' color='#8B8D97' fontSize='13px'>Edit Subscription</BreadcrumbLink>
                            </BreadcrumbItem>
                        </Breadcrumb>
                     <div>EditSubscription</div>
                    </Box>
                    <Footer />
                </Box>
            </HStack>
                                    

        </Box>
  )
}

export default EditSubscription;