import React from "react";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, HStack, VStack, TableContainer, Image, IconButton, Tooltip } from "@chakra-ui/react";
import { FaDownload } from "react-icons/fa";
import { TbDownloadOff } from "react-icons/tb";
import fileIcon from "../../../assets/icons/Upload.svg";
import CalendarIcon from "../../../assets/icons/Details.svg";

const DocumentsUpload = ({ Heading, SubHeading, TableHeading, TableData }) => {

  // Trigger download
  const handleDownload = (fileUrl, fileName) => {
  if (!fileUrl) return alert("No file available for download.");

  const link = document.createElement("a");
  link.href = fileUrl;
  link.download = fileName || "document";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  const columns = [...TableHeading, "Action"]; // Add Action column

  return (
    <HStack height={"500px"} align={"start"}>
      <VStack gap="2px" marginInline={"1.125rem"} justifySelf={"center"} height={"full"} spacing={0} align="center" paddingTop={"1.5rem"}>
        <Box width="10px" height={"10px"} borderRadius="50%" backgroundColor="#DCDCDE" />
        <Box width="1px" height="full" backgroundColor="#DCDCDE" />
      </VStack>
      <VStack paddingBottom={"5rem"} id='documents-upload' align={"start"} w="full" marginTop={"2rem"}>
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
                    {columns.map((item, index) => (
                      <Th
                        key={index}
                        textTransform={"capitalize"}
                        fontSize={'14px'}
                        fontFamily={"Albert Sans"}
                        color="white"
                        // paddingLeft={"4rem"}
                        w={"315px"}
                        backgroundColor={"#364261"}
                        height={"46px"}
                        borderTopLeftRadius={index === 0 ? "8px" : "0"}
                        borderTopRightRadius={index === columns.length - 1 ? "8px" : "0"}
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
                    {TableData?.length > 0 ? (
                      TableData.map((item, index) => (
                        <Tr key={index}>
                          {TableHeading.map((heading, i) => {
                            const key = Object.keys(item).find(k =>
                              k.toLowerCase().replace(/\s/g, '') === heading.toLowerCase().replace(/\s/g, '')
                            );

                            return (
                              <Td key={i} textTransform={"capitalize"} fontSize={"14px"} w={"215px"} fontFamily={"Albert Sans"}>
                                {heading.toLowerCase().includes("file details") ? (
                                  item[key] !== "Pending Document" ? (
                                    <HStack>
                                      <Image src={fileIcon} alt="File Icon" boxSize="16px" />
                                      <Text>{item[key]}</Text>
                                    </HStack>
                                  ) : (
                                    <Text>{item[key]}</Text>
                                  )
                                ) : heading.toLowerCase().includes("upload date") ? (
                                  <HStack>
                                    <Image src={CalendarIcon} alt="Calendar Icon" boxSize="16px" />
                                    <Text>{item[key]}</Text>
                                  </HStack>
                                ) : (
                                  item[key]
                                )}
                              </Td>
                            );
                          })}

                          {/* Action Icon Button */}
                          <Td>
                            {item.image ? (
                              <Tooltip label="Download">
                                <IconButton
                                  size="sm"
                                  aria-label="Download Document"
                                  icon={<FaDownload />}
                                  onClick={() => handleDownload(item.image, item.documentName)}
                                  variant="ghost"
                                  cursor={"pointer"}
                                />
                              </Tooltip>
                            ) : (
                              <Text color="black" fontWeight={"bold"} fontSize={"1.3rem"}>
                                <TbDownloadOff />
                              </Text>
                            )}
                          </Td>

                        </Tr>
                      ))
                    ) : (
                      <Tr>
                        <Td colSpan={columns.length} textAlign="center">
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

