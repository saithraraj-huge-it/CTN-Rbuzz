import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  RefreshControl,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const ReportTable = ({
  data = [],
  headers = [],
  loading = false,
  onRefresh = () => {},
  refreshing = false,
  onEndReached = () => {},
  formatRowData = () => [],
  theme,
}) => {
  const getCellWidth = header => {
    if (header === 'Farmer' || header === 'Flower') return 180;
    if (header === 'S.No') return 60;
    return 100;
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={[styles.table, {backgroundColor: theme.colors.surface}]}>
        <View
          style={[
            styles.tableHeader,
            {
              backgroundColor: theme.colors.primary,
              borderBottomColor: theme.colors.border,
            },
          ]}>
          {headers.map((header, index) => (
            <Text
              key={index}
              style={[
                styles.tableHeaderCell,
                {
                  width: getCellWidth(header),
                },
              ]}
              allowFontScaling={false}>
              <Text
                style={[
                  header === 'S.No' ? styles.snoHeaderText : styles.headerText,
                  {
                    color: theme.colors.card,
                    fontFamily: theme.typography.fontFamily.bold,
                    fontSize: theme.typography.fontSize.xs,
                  },
                ]}>
                {header}
              </Text>
            </Text>
          ))}
        </View>

        <FlatList
          data={data}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            const rowValues = formatRowData(item, index);
            return (
              <View
                style={[
                  styles.tableRow,
                  {
                    borderBottomColor: theme.colors.border,
                    backgroundColor: theme.colors.primaryLight + '30',
                  },
                ]}>
                {rowValues.map((value, idx) => (
                  <Text
                    key={idx}
                    style={[
                      styles.tableCell,
                      {
                        width: getCellWidth(headers[idx]),
                      },
                    ]}
                    allowFontScaling={false}>
                    <Text
                      style={[
                        headers[idx] === 'S.No'
                          ? styles.snoText
                          : styles.cellText,
                        {
                          color: theme.colors.text,
                          fontFamily: theme.typography.fontFamily.light,
                          fontSize: theme.typography.fontSize.s,
                        },
                      ]}>
                      {value || '-'}
                    </Text>
                  </Text>
                ))}
              </View>
            );
          }}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.3}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListFooterComponent={
            loading ? (
              <ActivityIndicator size="small" color={theme.colors.primary} />
            ) : null
          }
        />
      </View>
    </ScrollView>
  );
};

export default ReportTable;

const styles = StyleSheet.create({
  table: {
    width: '100%',
    borderRadius: 8,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 2,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
  },
  tableHeaderCell: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
    flexWrap: 'wrap',
  },
  headerText: {
    textAlign: 'center',
  },
  snoHeaderText: {
    textAlign: 'center',
    width: 60,
  },
  tableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
    borderBottomWidth: 1,
  },
  tableCell: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
    flexWrap: 'wrap',
  },
  snoText: {
    textAlign: 'center',
  },
  cellText: {
    textAlign: 'center',
  },
});
