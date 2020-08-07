import React from "react";
import {Tab, Table} from "semantic-ui-react";

const RenderSqlResult = (result) => {

  if (!(result instanceof Array)) return ''

  const panes = result.map(({columns, values}, index) => {
    return {
      menuItem: `SELECT Result ${index}`,
      render: () => <>
        <Table celled striped  compact='very'>
          <Table.Header>
            <Table.Row>
              {
                columns.map(column => <Table.HeaderCell>{column}</Table.HeaderCell>)
              }
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {
              values.map(value => <Table.Row>
                {
                  value.map( v => <Table.Cell>{v}</Table.Cell>
                  )
                }
              </Table.Row>)
            }
          </Table.Body>
        </Table>
      </>,
    }
  });


  return (
    <React.Fragment>
      <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
    </React.Fragment>
  )
}

export default RenderSqlResult;
