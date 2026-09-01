import React, { useState } from 'react';

import { Input, HStack, Text, VStack, Checkbox, Box } from "@chakra-ui/react";

const Addresses = (AddressObj) => {
    const InputStyle = {
        padding: "12px 15px",
        _placeholder: { color: "black" },
        color: "black",
        borderRadius: "12px",
        width: "100%",
        height: "48px",
        boxShadow: "0px 1px 2px rgba(0,0,0,5%)",
        border: "none",
        iconcolor: "#8B8D97"
    };

    const [isBillingSame, setIsBillingSame] = useState(false);

    const billingTextColor = isBillingSame ? "#8C8C91" : "#0B0C14";

    return (

        <VStack align={"start"}>
            {/* Business Address Section */}
            <HStack height={"445px"} align={"start"}>
                <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                    <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                    <Box width="1px" height="full" backgroundColor="#DCDCDE" />
                </VStack>
                <VStack id='business-address' align="start" w="full" mt="2rem">
                    <VStack align="start" gap={0} mb="1rem">
                        <Text fontSize="18px" color="#0B0C14">Business Address</Text>
                        <Text fontSize="16px" color="#8C8C91">Registered Address</Text>
                    </VStack>

                    <HStack ml="9.5rem">
                        <VStack flexWrap="wrap" gap="1.25rem" align="start">
                            <HStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Contact Person Name</Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Name ?? "Name"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Contact Person No.</Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Number ?? "Number"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Email Id<sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Email ?? "Email"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Website Address</Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.WebsiteAddress ?? "Website URL"} />
                                </VStack>
                            </HStack>

                            <HStack width="100%">
                                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Address Line 1 <sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Address ?? "Enter Address"} />
                                </VStack>

                                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Address Line 2</Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Address ?? "Enter Address"} />
                                </VStack>
                            </HStack>

                            <HStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Select City<sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.City ?? "Enter City"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">Select State<sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.State ?? "State"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color="#8C8C91">PinCode<sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Pin ?? "Pin"} />
                                </VStack>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
            </HStack>
            {/* Billing Address Section */}
            <HStack height={"445px"} align={"start"}>
                <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                    <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                    <Box width="1px" height="full" backgroundColor="#DCDCDE" />
                </VStack>
                <VStack id='billing-address' align="start" w="full" mt="2rem">
                    <VStack align="start" gap={0} mb="1rem">
                        <Text fontSize="18px" color={billingTextColor}>Billing Address</Text>
                        <HStack>
                            <Text fontSize="16px" color={billingTextColor}>If same as above, select the check box</Text>
                            <Checkbox onChange={(e) => setIsBillingSame(e.target.checked)} />
                        </HStack>
                    </VStack>

                    <HStack ml="9.5rem">
                        <VStack flexWrap="wrap" gap="1.25rem" align="start">
                            <HStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Contact Person Name</Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Name ?? "Name"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Contact Person No.</Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Number ?? "Number"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Email Id<sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Email ?? "Email"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Website Address</Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.WebsiteAddress ?? "Website URL"} />
                                </VStack>
                            </HStack>

                            <HStack width="100%">
                                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Address Line 1 <sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Address ?? "Enter Address"} />
                                </VStack>

                                <VStack flex={1} width="100%" align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Address Line 2</Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Address ?? "Enter Address"} />
                                </VStack>
                            </HStack>

                            <HStack>
                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Select City<sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.City ?? "Enter City"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>Select State<sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.State ?? "State"} />
                                </VStack>

                                <VStack align="start" mr="0.45rem">
                                    <Text fontSize="14px" color={billingTextColor}>PinCode<sup>*</sup></Text>
                                    <Input sx={InputStyle} placeholder={AddressObj.Pin ?? "Pin"} />
                                </VStack>
                            </HStack>
                        </VStack>
                    </HStack>
                </VStack>
            </HStack>

      
        </VStack>
    );
};

export default Addresses;
