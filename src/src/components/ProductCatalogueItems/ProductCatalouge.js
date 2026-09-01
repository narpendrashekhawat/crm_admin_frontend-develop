import { Box, HStack } from "@chakra-ui/react";
import React from "react";
import LeftSidebar from "../LeftSideBarLayout/LeftSideBar";
import HeaderBar from "../Header/HeaderBar";
import ProductCatalogueItemsInfo from "./ProductCatalogueItemsInfo";




const ProductCatalogue = () => {
    return (
        <>
            <Box backgroundColor='#F0F4F9' height={"100%"}>
                <HStack justifyContent='space-between' px='20px' alignItems='flex-start'>
                    <LeftSidebar />
                    <Box width='80%'>
                        <HeaderBar />
                        <ProductCatalogueItemsInfo />
                    </Box>
                </HStack>
            </Box>
        </>
    )
}

export default ProductCatalogue