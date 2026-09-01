import React,{useState} from "react";
import { Box, Input, HStack, Text, VStack} from "@chakra-ui/react";

const BankDetails = ({ bankDetails = {}, onChange = () => {} }) => {
  const InputStyle = {
    padding: "10px 12px",
    _placeholder: { color: "#bebcbcff" },
    color: "black",
    borderRadius: "12px",
    width: "100%",
    height: "48px",
    boxShadow: "0px 1px 2px rgba(0,0,0,5%)",
     border: "1px solid #bfc0c540 ",
  };



  return (
    <HStack align={"start"} spacing={3}>
     

     {/* Left Timeline bar */}
                      <VStack
                        gap="2px"
                        marginInline={"1.125rem"}
                        justifySelf={"center"}
                        height={"full"}
                        spacing={0}
                        align="center"
                        paddingTop={"1.5rem"}
                      >
                        <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
                        <Box width="1px" height="150px" backgroundColor="#DCDCDE" />
                      </VStack>
        <VStack align="start"  id="bankdata">
      <Text fontSize="18px" fontWeight="400">Bank Details</Text>
      <Text fontSize="16px" color="#8C8C91">Account Information</Text>
      
        <HStack spacing="1rem" align="stretch" w="full" p={4}  bg="white">
            <VStack  width={"100%"} align={"start"} marginRight={"0.45rem"}>
             <Text fontSize={"14px"} color={"#8C8C91"} paddingLeft={"15px"}>
             Account Holder Name<sup>*</sup>
             </Text>
             <HStack  variant={"unstyled"}

                                width="100%"
                                // borderRadius="12px"
                                height="48px"
                                // dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                // border="1px solid #E2E8F0"
                                border={"none"}
                                padding="0 12px"
                                justifyContent="space-between">
          <Input
            sx={InputStyle}
            placeholder="Account Holder Name"
            value={bankDetails.accountHolder || ""}
              onChange={(e) => onChange("accountHolder", e.target.value)}
          />
          </HStack>
          </VStack>

          <VStack  width={"100%"} align={"start"} marginRight={"0.45rem"}>
             <Text fontSize={"14px"} color={"#8C8C91"} paddingLeft={"15px"}>
             Bank Full Name<sup>*</sup>
             </Text>
             <HStack  variant={"unstyled"}

                                 width="100%"
                                // borderRadius="12px"
                                height="48px"
                                // dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                // border="1px solid #E2E8F0"
                                border={"none"}
                                padding="0 12px"
                                justifyContent="space-between">
          <Input
            sx={InputStyle}
            placeholder="Bank Full Name"
           value={bankDetails.bankName || ""}
              onChange={(e) => onChange("bankName", e.target.value)}
          />

          </HStack>
          </VStack>

          <VStack  width={"100%"} align={"start"} marginRight={"0.45rem"}>
             <Text fontSize={"14px"} color={"#8C8C91"} paddingLeft={"15px"}>
             Account Number<sup>*</sup>
             </Text>
             <HStack  variant={"unstyled"}

                                 width="100%"
                                // borderRadius="12px"
                                height="48px"
                                // dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                // border="1px solid #E2E8F0"
                                border={"none"}
                                padding="0 12px"
                                justifyContent="space-between">
          <Input
            sx={InputStyle}
            type="number"
            placeholder="Account Number"
            value={bankDetails.accountNumber || ""}
              onChange={(e) => onChange("accountNumber", e.target.value)}
          />

          </HStack>
          </VStack>

          <VStack  width={"100%"} align={"start"} marginRight={"0.45rem"}>
             <Text fontSize={"14px"} color={"#8C8C91"} paddingLeft={"15px"}>
             IFSC Code<sup>*</sup>
             </Text>
             <HStack  variant={"unstyled"}

                                width="100%"
                                // borderRadius="12px"
                                height="48px"
                                // dropShadow="0px 1px 2px rgba(0,0,0,5%)"
                                // border="1px solid #E2E8F0"
                                border={"none"}
                                padding="0 12px"
                                justifyContent="space-between">
          <Input
            sx={InputStyle}
            placeholder="IFSC Code"
            value={bankDetails.ifsc || ""}
              onChange={(e) => onChange("ifsc", e.target.value)}
          />

          </HStack>
          </VStack>
        </HStack>
        </VStack>
      </HStack>
     
    
  );
};

export default BankDetails;
