import React from "react";
import {
    Text,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Box, HStack
} from "@chakra-ui/react";

const SubscriptionsEntities = ({ Heading, SubHeading, TableHeading, TableData }) => {
    return (

        <HStack height={"445px"} align={"start"}>
        <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
            <Box width="10px" height="10px" borderRadius="50%" backgroundColor="#DCDCDE" />
            <Box width="1px" height="full" backgroundColor="#DCDCDE" />
            </VStack>
            <VStack align={"start"} w="full" marginTop={"2rem"}>
                {/* Heading & Subheading */}
                <VStack align={"start"} gap={0} marginBottom={"1rem"}>
                    <Text fontSize={"18px"} color={"#0B0C14"}>{Heading}</Text>
                    <Text fontSize={"16px"} color={"#8C8C91"}>{SubHeading}</Text>
                </VStack>

                 {/* Table with Fixed Header and Scrollable Body */}
                 <VStack align={"start"} marginLeft={"4.5rem"} width={"100%"}>
                    <Box minWidth="840px" borderRadius="8px" border={"1px solid #D0D5DD"}>
                        {/* Header Section (Separate from Scrollable Body) */}
                        <TableContainer>
                            <Table variant="simple">
                            <Thead>
                                    <Tr>
                                        {TableHeading.map((item, index) => (
                                            <Th
                                                textTransform={"capitalize"}
                                                fontSize={"14px"}
                                                fontFamily={"Albert Sans"}
                                                key={index}
                                                color="white"
                                                background={"#364261"}
                                                height={"46px"}
                                                borderTopLeftRadius={index === 0 ? "8px" : "0"}
                                                borderTopRightRadius={index === TableHeading.length - 1 ? "8px" : "0"}
                                            >
                                                {item}
                                            </Th>
                                        ))}
                                    </Tr>
                                </Thead>
                            </Table>
                        </TableContainer>

                        {/* Scrollable Table Body */}
                        <Box maxH="214px" scrollBehavior={"smooth"} overflowY="auto">
                            <TableContainer>
                                <Table variant="simple">
                                    <Tbody>
                                        {TableData.length > 0 ? (
                                            TableData.map((item, index) => (
                                                <Tr key={index}>
                                                    {TableHeading.map((heading, i) => {
                                                        const key = Object.keys(item).find(k =>
                                                            k.toLowerCase().replace(/\s/g, '') === heading.toLowerCase().replace(/\s/g, '')
                                                        );

                                                       // Style for "Status" column
                                                       if (heading.toLowerCase() === "status") {
                                                        return (
                                                            <Td textTransform={"capitalize"}
                                                                fontSize={"14px"}
                                                                fontFamily={"Albert Sans"}
                                                                key={i} color={item[key] === "Active" ? "green.500" : "green.500"} >
                                                                {key ? item[key] : "Active"}
                                                            </Td>
                                                        );
                                                    }

                                                    return <Td textTransform={"capitalize"}
                                                        fontSize={"14px"}
                                                        fontFamily={"Albert Sans"}
                                                        color={"#364261"} key={i}>{key ? item[key] : "Active"}</Td>;
                                                })}
                                            </Tr>
                                        ))
                                    ) : (
                                        <Tr>
                                            <Td colSpan={TableHeading.length} textAlign="center">
                                                No data available
                                            </Td>
                                            </Tr>
                                          )}
                                          </Tbody>
                                      </Table>
                                  </TableContainer>
                              </Box>
                    </Box>
                    </VStack>
            </VStack>
            </HStack>        
    );
};

export default SubscriptionsEntities;
