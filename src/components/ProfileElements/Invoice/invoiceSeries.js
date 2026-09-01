import React,  { useState } from 'react'
import { Box, Input, HStack, Text, VStack, border } from "@chakra-ui/react";

const InvoiceSeries = ({ invoiceData }) => {



    const InputStyle = {
        padding: "12px 15px",
        _placeholder: { color: "#bebcbcff" },
        color: "black",
        borderRadius: "12px",
        width: "100%",
        height: "48px",
        boxShadow: "0px 1px 2px rgba(0,0,0,5%)",
        border: "1px solid #bfc0c540 ",
        iconcolor: "#8B8D97",
        _focusVisible: {
    outline: "none",      
    boxShadow: "none",    
    border: "1px solid #bfc0c540" 
  }
    };
// GET se jo data aayega wo yaha dikhega
  const invInitials = invoiceData?.invInitials || "INV2025-";  
  const series = invoiceData?.series || "";  
  const sampleNumber = `${invInitials}${series}`;

  return (
     <HStack height={"200px"} align={"start"}>
            <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                <Box width="1px" height="150px" backgroundColor="#DCDCDE" />
            </VStack>
            <VStack align={"start"} id='invoice'>
                <VStack align={"start"} gap={0} marginTop={"2rem"} marginBottom={"1rem"}>
                    <Text fontSize={"18px"} color={"#0B0C14"}>Invoice Series</Text>
                    <Text fontSize={"16px"} color={"#8C8C91"}>Invoice Number</Text>
                </VStack>

                 <HStack gap={"2.5rem"} align={"start"}>

                    <VStack flexWrap={"wrap"} gap={"1.25rem"} align={"start"}>
                      
                          <HStack >
                             <VStack  width={"100%"} align={"start"} marginRight={"0.45rem"}>
                                         <Text fontSize={"14px"} color={"#8C8C91"} paddingLeft={"15px"}>
                                         unique Series<sup>*</sup>
                                         </Text>
                                         <HStack                              
                                                            width="100%"
                                                            // borderRadius="12px"
                                                            height="48px"
                                                            // dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                                            // border="1px solid #E2E8F0"
                                                            border={"none"}
                                                            padding="0 12px"
                                                            justifyContent="space-between">
                        <Input variant={"unstyled"} readOnly value={invInitials} />
                         </HStack>
                         </VStack>

                          <VStack  width={"100%"} align={"start"} marginRight={"0.45rem"}>
             <Text fontSize={"14px"} color={"#8C8C91"} paddingLeft={"15px"}>
             Start Invoice Number<sup>*</sup>
             </Text>
             <HStack  variant={"unstyled"}

                                 width="100%"
                                // borderRadius="12px"
                                 height="48px"
                                // dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                // border="1px solid #E2E8F0"
                                border={"none"}
                                 padding="0 12px"
                                // justifyContent="space-between"
                                >
                        <Input sx={InputStyle}   type="number" readOnly value={series} placeholder=' Invoice Number' />
                        </HStack>
                       </VStack>

                        <VStack  width={"100%"} align={"start"} marginRight={"0.45rem"}>
             <Text fontSize={"14px"} color={"#8C8C91"} paddingLeft={"15px"}>
             Sample Invoice Number<sup>*</sup>
             </Text>
             <HStack  

                                width="100%"
                                // borderRadius="12px"
                                height="48px"
                                // dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                border="none"
                                padding="0 12px"
                                justifyContent="center">
                                    
                       <Input variant={"unstyled"} readOnly value={sampleNumber}  /> 

                        </HStack>
                        </VStack>
                       </HStack>
                      
                       
                    </VStack>

                </HStack> 


            </VStack>
        </HStack>
  )
}

export default InvoiceSeries;