import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, } from "@chakra-ui/react";
import React from "react";
import { GoHomeFill } from "react-icons/go";
import Footer from "../footer";
const DistributorItemsInfo = () => {


    return (
        <>
            <Box p={4} height={"100dvh"} bg="white" mt='1rem' padding='12px 20px' borderRadius='15px 15px 0px 0px'>
                <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px' >
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/distributor'><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink href='/distributor' color='#5570F1' fontSize='13px'>Distributor</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                

            </Box>
            
           
        </>
        
    )
}

export default DistributorItemsInfo