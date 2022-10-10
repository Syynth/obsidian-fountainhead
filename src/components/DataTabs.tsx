import {
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  TabsProps,
} from '@chakra-ui/react';
import { Fragment, ReactElement } from 'react';

interface DataTabsProps<T> extends Omit<TabsProps, 'children'> {
  items: T[];
  getTab(item: T, index: number): ReactElement;
  getContent(item: T, index: number): ReactElement;
}

export function DataTabs<T>({
  items,
  getTab,
  getContent,
  ...rest
}: DataTabsProps<T>) {
  return (
    <Tabs {...rest}>
      <TabList>
        {items.map((tab, index) => (
          <Fragment key={index}>{getTab(tab, index)}</Fragment>
        ))}
      </TabList>
      <TabPanels>
        {items.map((tab, index) => (
          <TabPanel p={4} key={index}>
            {getContent(tab, index)}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
  );
}
