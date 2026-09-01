import React from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Flex,
  Badge,
  IconButton,
  Select,
  HStack,
  useColorModeValue
} from '@chakra-ui/react';
import { 
  FiSearch, 
  FiChevronDown, 
  FiEdit2, 
  FiChevronLeft, 
  FiChevronRight,
  FiSliders
} from 'react-icons/fi';

const ProductMaster = () => {
  const headerBg = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.1600');

  const products = [
    {
      id: 1,
      medicineName: 'Augmentin 625 Duo Tablet',
      saltComposition: 'Amoxicillin (500mg)\nClavulanic Acid (125mg)',
      packagingDetail: 'Strip',
      packagingValue: '100',
      form: 'Tablet',
      addedDate: '12 Aug 2022',
      status: 'Locked'
    },
    {
      id: 2,
      medicineName: 'Zyvocol 1% Dusting Powder',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Bottle',
      packagingValue: '120ml',
      form: 'Oral Drop',
      addedDate: '12 Aug 2022',
      status: 'Locked'
    },
    {
      id: 3,
      medicineName: 'Zi Fast 500mg Injection',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Vial',
      packagingValue: '20',
      form: 'Tablet',
      addedDate: '12 Aug 2022',
      status: 'Unlocked'
    },
    {
      id: 4,
      medicineName: 'Augmentin Duo Oral Suspension',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Strip',
      packagingValue: '100',
      form: 'Tablet',
      addedDate: '12 Aug 2022',
      status: 'Unlocked'
    },
    {
      id: 5,
      medicineName: 'Overson T 250mg/31.25mg Injection',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Strip',
      packagingValue: '80',
      form: 'Tablet',
      addedDate: '12 Aug 2022',
      status: 'Unlocked'
    },
    {
      id: 6,
      medicineName: 'StayHappi Cefixime+Clavulanic Acid',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Vial',
      packagingValue: '90ml',
      form: 'Suspension',
      addedDate: '12 Aug 2022',
      status: 'Locked'
    },
    {
      id: 7,
      medicineName: 'Rabipraz 20mg Tablet',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Strip',
      packagingValue: '12',
      form: 'Publish',
      addedDate: '12 Aug 2022',
      status: 'Locked'
    },
    {
      id: 8,
      medicineName: 'Mefhabet-DR Tablet',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Strip',
      packagingValue: '08',
      form: 'Tablet',
      addedDate: '12 Aug 2022',
      status: 'Locked'
    },
    {
      id: 9,
      medicineName: 'Leupo 11.25mg Injection',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Strip',
      packagingValue: '16',
      form: 'Injection',
      addedDate: '12 Aug 2022',
      status: 'Locked'
    },
    {
      id: 10,
      medicineName: 'H-Pan 40mg Tablet',
      saltComposition: 'Phenylephrine (5mg/5ml)\nChlorpheniramine Maleate (2mg/5ml)',
      packagingDetail: 'Vial',
      packagingValue: '130ml',
      form: 'Suspension',
      addedDate: '12 Aug 2022',
      status: 'Unlocked'
    }
  ];

  return (
    
    <Box p={4} w="full" bg='white'>
      {/* Header */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Text fontSize="xl" fontWeight="bold">Product Master</Text>
        <Flex alignItems="center" gap={4}>
          <Text color="gray.500" fontSize="sm">Memory usage: 48%</Text>

          <InputGroup w="300px">
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input placeholder="Search by Product Name/Code Or Salt" size="md" borderRadius="md" />
          </InputGroup>

          <Button rightIcon={<FiChevronDown />} variant="outline" size="md">
            Bulk Action
          </Button>
        </Flex>
      </Flex>

      {/* Table */}
      <Box overflowX="auto" borderWidth="1px" borderRadius="lg" borderColor={borderColor} bg='white'>
        <Table variant="simple" size="md">
          <Thead bg={headerBg}>
            <Tr>
              <Th px={4} py={3} w="40px">
                <Checkbox colorScheme="blue" />
              </Th>
              <Th px={4} py={3}>
                <Flex alignItems="center">
                  <Text>Medicine Name</Text>
                  <FiSliders style={{ marginLeft: '4px' }} />
                </Flex>
              </Th>
              <Th px={4} py={3}>
                <Flex alignItems="center">
                  <Text>Salt Composition</Text>
                  <FiSliders style={{ marginLeft: '4px' }} />
                </Flex>
              </Th>
              <Th px={4} py={3}>
                <Flex alignItems="center">
                  <Text>Packaging Detail</Text>
                  <FiSliders style={{ marginLeft: '4px' }} />
                </Flex>
              </Th>
              <Th px={4} py={3}>
                <Flex alignItems="center">
                  <Text>Added Date</Text>
                  <FiSliders style={{ marginLeft: '4px' }} />
                </Flex>
              </Th>
              <Th px={4} py={3}>
                <Flex alignItems="center">
                  <Text>Status</Text>
                  <FiSliders style={{ marginLeft: '4px' }} />
                </Flex>
              </Th>
              <Th px={4} py={3}>
                <Flex alignItems="center">
                  <Text>Action</Text>
                  <FiSliders style={{ marginLeft: '4px' }} />
                </Flex>
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td px={4} py={3}>
                  <Checkbox colorScheme="blue" />
                </Td>
                <Td px={4} py={3}>{product.medicineName}</Td>
                <Td px={4} py={3}>
                  <Text whiteSpace="pre-line">{product.saltComposition}</Text>
                </Td>
                <Td px={4} py={3}>
                  <HStack spacing={4}>
                    <Text>{product.packagingDetail}</Text>
                    <Text color="gray.500">{product.packagingValue}</Text>
                    <Text color="gray.500">{product.form}</Text>
                  </HStack>
                </Td>
                <Td px={4} py={3}>{product.addedDate}</Td>
                <Td px={4} py={3}>
                  <Badge 
                    px={3} 
                    py={1} 
                    borderRadius="full" 
                    colorScheme={product.status === 'Locked' ? 'purple' : 'blue'}
                    bg={product.status === 'Locked' ? 'purple.100' : 'blue.100'}
                    color={product.status === 'Locked' ? 'purple.600' : 'blue.600'}
                  >
                    {product.status}
                  </Badge>
                </Td>
                <Td px={4} py={3}>
                  <IconButton 
                    aria-label="Edit product"
                    icon={<FiEdit2 />} 
                    variant="ghost" 
                    colorScheme="gray"
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Footer - Pagination */}
      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <HStack spacing={2}>
          <Select size="sm" w="60px" defaultValue="10">
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </Select>
          <Text fontSize="sm" color="gray.600">items per page</Text>
        </HStack>

        <Text fontSize="sm" color="gray.600">1-10 of 200 items</Text>

        <HStack spacing={2}>
          <HStack spacing={1}>
            <Select size="sm" w="60px" defaultValue="1">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
            </Select>
            <Text fontSize="sm" color="gray.600">of 44 pages</Text>
          </HStack>

          <IconButton
            icon={<FiChevronLeft />}
            aria-label="Previous page"
            size="sm"
            variant="ghost"
          />
          <IconButton
            icon={<FiChevronRight />}
            aria-label="Next page"
            size="sm"
            variant="ghost"
          />
        </HStack>
      </Flex>
      
    </Box>

  );
};

export default ProductMaster;