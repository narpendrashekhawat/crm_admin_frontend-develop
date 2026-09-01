import { Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink, } from "@chakra-ui/react";
import React from "react";
import { GoHomeFill } from "react-icons/go";
import ProductSummary from "./ProductSummary"
const ProductCatalogueItemsInfo = () => {


    return (
        <>
            <Box p={4}  bg="white" mt='1rem' padding='12px 20px' borderRadius='15px 15px 0px 0px'>
                <Breadcrumb color="#8B8D97" padding='10px 0px 2rem 0px' >
                    <BreadcrumbItem>
                        <BreadcrumbLink href='/product-catalogue'><GoHomeFill color="#5570F1" /> </BreadcrumbLink>
                    </BreadcrumbItem>

                    <BreadcrumbItem>
                        <BreadcrumbLink href='/product-catalogue' color='#5570F1' fontSize='13px'>Product Catalogue</BreadcrumbLink>
                    </BreadcrumbItem>
                </Breadcrumb>
                 <ProductSummary/>
            </Box>
        </>
    )
}

export default ProductCatalogueItemsInfo