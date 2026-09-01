import React from "react";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, HStack, VStack, TableContainer,Image, } from "@chakra-ui/react";
import fileIcon from "../../../assets/icons/Upload.svg";
import CalendarIcon from "../../../assets/icons/Details.svg";



const DocumentsUpload = ({ Heading, SubHeading, TableHeading, TableData }) => {
  return (
        <HStack height={"500px"} align={"Start"}>
            <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} w={""} spacing={0} align="center" paddingTop={"1.5rem"}>
                <Box width="10px" height={"10px"} borderRadius="50%" backgroundColor="#DCDCDE" />
                <Box width="1px" height="full" backgroundColor="#DCDCDE" />
            </VStack>
            <VStack paddingBottom={"5rem"} id='documents-upload' align={"start"} w="ful" marginTop={"2rem"}>
                <VStack align={"start"} gap={0} marginBottom={"1rem"}>
                    <Text fontSize={"18px"} color={"#0B0C14"}>{Heading}</Text>
                    <Text fontSize={"16px"} color={"#8C8C91"}>{SubHeading}</Text>
                </VStack>

                <VStack align={"start"} width={'100%'}>
                    <Box w="840px" borderRadius="8px" border={"1px solid #D0D5DD"}>
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        {TableHeading.map((item,index) => (
                                            <Th
                                            textTransform={"capitalize"}
                                            fontSize={'14px'}
                                            fontFamily={"Albert Sans"}
                                            key={index}
                                            color="white"
                                            w={"315px"}
                                            backgroundColor={"#364261"}
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

                        <Box scrollBehavior={"smooth"}>
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
                                                        return (
                                                            <Td textTransform={"capitalize"}
                                                                fontSize={"14px"}
                                                                w={"315px"}
                                                                fontFamily={"Albert Sans"}
                                                                key={i}
                                                            >
                                                                {/* Use custom images based on column type */}
                                                                {heading.toLowerCase().includes("file details") ? (
                                                                    item[key] !== "Pending Document" ? ( // Check if the value is NOT "Pending Document"
                                                                        <HStack>
                                                                            <Image src={CalendarIcon} alt="Cal Icon" boxSize="16px" />
                                                                            <Text>{item[key]}</Text>
                                                                        </HStack>
                                                                    ) : (
                                                                        <Text>{item[key]}</Text> // Show only text when it's "Pending Document"
                                                                    )
                                                                ) : heading.toLowerCase().includes("upload date") ? (
                                                                    <HStack>
                                                                        <Image src={fileIcon} alt="fileIcon" boxSize="16px" />
                                                                        <Text>{item[key]}</Text>
                                                                    </HStack>
                                                                ) : (
                                                                    item[key]
                                                                )}

                                                            </Td>
                                                        );
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

export default DocumentsUpload;