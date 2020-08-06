import React from "react";
import {Icon, Table} from "semantic-ui-react";

const RenderSqlResult = (result) => {

  if (!(result instanceof Array)) return ''
  return (
    <React.Fragment>
      {
        result.map(
          ({columns, values}, index) => <Table celled striped  compact='very'>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell colSpan={columns.length.toString()}>SELECT Result {index}</Table.HeaderCell>
              </Table.Row>
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
        )
      }
    </React.Fragment>
  )
}

export default RenderSqlResult;
