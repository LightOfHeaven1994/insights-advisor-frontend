import {
  Column,
  Section,
  Table,
} from '@redhat-cloud-services/frontend-components-pdf-generator/dist/esm/index';
import { Link, StyleSheet, Text } from '@react-pdf/renderer';

import { BASE_URI } from '../../AppConstants';
import PropTypes from 'prop-types';
import React from 'react';
import {
  c_table_m_compact_cell_PaddingBottom,
  c_table_m_compact_cell_PaddingLeft,
  c_table_m_compact_cell_PaddingTop,
  chart_global_Fill_Color_700,
  global_FontWeight_bold,
  global_link_Color,
  global_spacer_md,
} from '@patternfly/react-tokens';
import messages from '../../Messages';

const styles = StyleSheet.create({
  bold: { fontWeight: global_FontWeight_bold.value },
  link: { color: global_link_Color.value },
  text: { marginTop: global_spacer_md.value },
  nameColumn: { width: '220px' },
  header: {
    fontSize: 9,
    color: chart_global_Fill_Color_700.value,
    paddingLeft: c_table_m_compact_cell_PaddingLeft.value,
    paddingBottom: c_table_m_compact_cell_PaddingBottom.value,
    paddingTop: c_table_m_compact_cell_PaddingTop.value,
  },
});

export const TablePage = ({ page, systems, intl }) => {
  const header = [
    { value: intl.formatMessage(messages.name), style: styles.nameColumn },
    {
      value: intl.formatMessage(messages.recommendations),
      style: { width: '100px', textAlign: 'center' },
    },
    {
      value: intl.formatMessage(messages.critical),
      style: { width: '70px', textAlign: 'center' },
    },
    {
      value: intl.formatMessage(messages.important),
      style: { width: '70px', textAlign: 'center' },
    },
    {
      value: intl.formatMessage(messages.moderate),
      style: { width: '60px', textAlign: 'center' },
    },
    {
      value: intl.formatMessage(messages.low),
      style: { width: '90px', textAlign: 'center' },
    },
    {
      value: intl.formatMessage(messages.lastSeen),
      style: { marginLeft: '20px' },
    },
  ];
  const hitColumns = [
    'hits',
    'critical_hits',
    'important_hits',
    'moderate_hits',
    'low_hits',
  ];
  const headerBuilder = ({ value, style }) => (
    <Text style={{ ...style, ...styles.header, ...styles.bold }}>{value}</Text>
  );
  const rowBuilder = ({ value, style }) => <Text style={style}>{value}</Text>;
  const rows = [
    ...systems.map((system) => {
      const [, date, month, year, time] = new Date(system.last_seen)
        .toUTCString()
        .split(' ');
      const sysDate = `${date} ${month} ${year}, ${time
        .split(':')
        .slice(0, 2)
        .join(':')} UTC`;
      return [
        <Text key={system.system_uuid} style={styles.nameColumn}>
          <Link
            style={styles.link}
            src={`${BASE_URI}/insights/advisor/systems/${system.system_uuid}/`}
          >
            {system.display_name}
          </Link>
        </Text>,
        ...hitColumns.map((item) =>
          rowBuilder({ style: { width: '10px' }, value: system[item] }),
        ),
        <Text
          key={system.last_seen}
          style={{ width: '100px' }}
        >{`${sysDate}`}</Text>,
      ];
    }),
  ];

  return (
    <React.Fragment key={page}>
      <Column>
        <Table
          withHeader
          rows={[header.map((item) => headerBuilder(item)), ...rows]}
        />
      </Column>
    </React.Fragment>
  );
};

TablePage.propTypes = {
  systems: PropTypes.object,
  page: PropTypes.number,
  intl: PropTypes.any,
};

export const leadPage = ({ systemsTotal, systems, filters, tags, intl }) => {
  delete filters.offset;
  delete filters.limit;
  return (
    <React.Fragment
      key={`${intl.formatMessage(
        messages.insightsHeader,
      )}: ${intl.formatMessage(messages.systems)}`}
    >
      <Text key="sys-count" style={styles.text}>
        {intl.formatMessage(messages.sysTableCount, {
          systems: (
            <Text key="sys-count-count" style={styles.bold}>
              {intl.formatMessage(messages.execReportHeaderSystems, {
                systems: systemsTotal,
              })}
              {systemsTotal > 1000 && intl.formatMessage(messages.dueTo)}
            </Text>
          ),
        })}
      </Text>
      <Text key="sys-filters" style={styles.text}>
        {intl.formatMessage(messages.filtersApplied)}
      </Text>
      <Text key="sys-filters-values" style={styles.bold}>
        {Object.entries(filters).map((value) => (
          <Text key={value}>{`${value[0]}: ${value[1]}     `}</Text>
        ))}
      </Text>
      <Text key="sys-tags" style={styles.text}>
        {intl.formatMessage(messages.tagsApplied)}
      </Text>
      <Text key="sys-tags-values" style={styles.bold}>
        {tags ? decodeURIComponent(tags) : intl.formatMessage(messages.noTags)}
      </Text>
      <Section key="systems" title="Systems">
        <TablePage systems={systems} intl={intl} />
      </Section>
    </React.Fragment>
  );
};

leadPage.propTypes = {
  systems: PropTypes.object,
  systemsTotal: PropTypes.number,
  filters: PropTypes.object,
  tags: PropTypes.array,
  intl: PropTypes.any,
};
