import React from 'react'
import PropTypes from 'prop-types'

import URI from 'urijs'

import BioentityProperty from './BioentityProperty'
import Loading from './Loading'

import './BioentityInformation.css'

const fetchResponseJson = async (base, endpoint) => {
  const response = await fetch(URI(endpoint, base).toString())
  const responseJson = await response.json()
  return responseJson
}

class BioentityInformation extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      bioentityProperties: [],
      errorMessage: null,
      loading: false
    }
  }

  _fetchAndSetState({atlasUrl, geneId}) {
    const atlasEndpoint = `json/bioentity_information/${geneId}`

    return fetchResponseJson(atlasUrl, atlasEndpoint)
      .then((responseJson) => {
        this.setState({
          bioentityProperties: responseJson,
          errorMessage: null,
          loading: false
        })
      })
      .catch((reason) => {
        this.setState({
          errorMessage: `${reason.name}: ${reason.message}`
        })
      })
  }

  componentDidCatch(error, errorMessage) {
    this.setState({
      errorMessage: errorMessage
    })
  }

  componentDidMount() {
    this.setState({
      loading: true
    })
    return this._fetchAndSetState(this.props)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.atlasUrl !== this.props.atlasUrl || nextProps.geneId !== this.props.geneId) {
      this.setState({
        bioentityProperties: [],
        loading: true
      })
      this._fetchAndSetState(nextProps)
    }
  }

  render() {
    const bioentityProperties = this.state.bioentityProperties.map((property) =>
      <tr key={property.type}>
        <td className={`gxaBioentityInformationCardPropertyType`}>
          {property.name}
        </td>
        <td>
          <BioentityProperty type={property.type} values={property.values} />
        </td>
      </tr>
    )

    return (
      <div className={`row`}>
        <div className={`small-12 columns`}>
          <Loading loading={this.state.loading} resourcesUrl={this.props.atlasUrl}/>
          <table>
            <tbody>
              {bioentityProperties}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

BioentityInformation.propTypes = {
  atlasUrl: PropTypes.string.isRequired,
  geneId: PropTypes.string.isRequired
}

export default BioentityInformation
