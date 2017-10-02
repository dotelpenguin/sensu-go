import React from 'react';
import PropTypes from 'prop-types';
import map from 'lodash/map';
import { createFragmentContainer, graphql } from 'react-relay';

import Table, {
  TableBody,
  TableHead,
  TableCell,
  TableRow,
} from 'material-ui/Table';
import Checkbox from 'material-ui/Checkbox';
import EventRow from '../EventRow';

const styles = require('./eventsList.css');

class EventsList extends React.Component {
  static propTypes = {
    viewer: PropTypes.shape({
      events: PropTypes.array,
    }).isRequired,
  }

  render() {
    const { viewer } = this.props;

    return (
      <Table className={styles.table}>
        <TableHead>
          <TableRow>
            <TableCell checkbox>
              <Checkbox />
            </TableCell>
            <TableCell>Entity</TableCell>
            <TableCell>Check</TableCell>
            <TableCell>Command</TableCell>
            <TableCell>Timestamp</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {map(viewer.events, (event, i) => (
            <EventRow key={i} event={event} />
          ))}
        </TableBody>
      </Table>
    );
  }
}


export default createFragmentContainer(
  EventsList,
  graphql`
    fragment EventsList_viewer on Viewer {
      events {
        ...EventRow_event
      }
    }
  `,
);