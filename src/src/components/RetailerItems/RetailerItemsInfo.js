import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, Button, Input, Heading, HStack, ButtonGroup, Text, VStack } from "@chakra-ui/react";
import React from "react";
import { GoHomeFill } from "react-icons/go";
import Footer from "../footer";
const RetailerItemsInfo = () => {


    return (
        <>
            <Box p={4} height={"100dvh"} bg="white" mt='1rem' padding='12px 20px' borderRadius='15px 15px 0px 0px'>
                <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px' >
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/retailer'><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                    </BreadcrumbItem>
                        
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/retailer' color='#5570F1' fontSize='13px'>Retailer</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>

            </Box>
            
        </>
    )
}

export default RetailerItemsInfo