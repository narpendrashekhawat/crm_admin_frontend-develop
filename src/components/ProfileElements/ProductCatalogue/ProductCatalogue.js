import React from 'react'
import { Text, VStack, HStack, Input, Box } from "@chakra-ui/react";

const ProductCatalogue = (ProductCatalogueObj) => {
    console.log(ProductCatalogueObj, "iiiiiiioioioio");
    const { totalProducts, totalStocks, isRetailerProfile } = ProductCatalogueObj;

    console.log(isRetailerProfile, "ppopopoo")
    return (
        <HStack height={"245px"} align={"start"}>
            <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                <Box width="1px" height="full" backgroundColor="#DCDCDE" />
            </VStack>
            <VStack align={"start"} marginTop={"2rem"} >
                <VStack align={"start"} gap={0} marginBottom={"1rem"}>
                    <Text fontSize={"18px"} color={"#0B0C14"}>Product Catalog</Text>
                    <Text fontSize={"16px"} color={"#8C8C91"}>Catalog Details</Text>
                </VStack>

                <HStack align={"start"} gap={"2rem"} marginBottom={"1rem"} marginLeft={"4.5rem"} >
                     {isRetailerProfile === true ? (
                    <VStack p={0} width={"361px"} align={"start"} marginRight={"0.45rem"} paddingTop={"0"}>
                        <Text fontSize={"14px"} color={"#8C8C91"}>
                            Total Products Uploaded
                        </Text>
                        <HStack
                            width="100%"
                            borderRadius="12px"
                            height="48px"
                            dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                            border="1px solid #E2E8F0"
                            padding="0 12px"
                            justifyContent="space-between"
                        >
                            {/* Email Input taking full width */}
                            <Input
                                variant={"unstyled"}
                                type="email"
                                padding="12px 10px"
                                border="none"
                                width={"361px"}
                                height={"48px"}
                                readOnly
                                fontSize={"28px"}
                                _focus={{ border: "none", outline: "none" }}
                                _active={{ border: "none", outline: "none" }}
                                // _placeholder={dis}
                                color="black"
                                placeholder={totalProducts}
                                flex="1"
                            />
                        </HStack>

                    </VStack>
                    ) : null}
                    <VStack p={0} width={"361px"} align={"start"} marginRight={"0.45rem"}>
                        <Text fontSize={"14px"} color={"#8C8C91"}>
                            Stocks Uploaded
                        </Text>
                        <HStack
                            width="100%"
                            borderRadius="12px"
                            height="48px"
                            dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                            border="1px solid #E2E8F0"
                            padding="0 12px"
                            justifyContent="space-between"
                        >
                            {/* Email Input taking full width */}
                            <Input
                                variant={"unstyled"}
                                type="email"
                                padding="12px 10px"
                                border="none"
                                readOnly
                                width={"361px"}
                                height={"48px"}
                                fontSize={"28px"}
                                _focus={{ border: "none", outline: "none" }}
                                _active={{ border: "none", outline: "none" }}
                                _placeholder={{ color: "black" }}
                                color="black"
                                placeholder={totalStocks}
                                flex="1"
                            />
                        </HStack>

                    </VStack>
                </HStack>

            </VStack>
        </HStack>

    )
}

export default ProductCatalogue