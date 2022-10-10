import { useVault } from '~/hooks/app';
import { Box, HStack, Text, VStack } from '@chakra-ui/react';

export function ExplorerView() {
  const vault = useVault();
  const files = vault.getMarkdownFiles();

  return (
    <VStack align="stretch">
      <Box>Explorer view {files.length}</Box>
      {files.map((file, index) => (
        <HStack key={file.path + file.name}>
          <Text>
            {index + 1}: {file.name}
          </Text>
        </HStack>
      ))}
    </VStack>
  );
}
