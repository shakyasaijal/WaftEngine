import React from 'react';
import PropTypes from 'prop-types';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { Helmet } from 'react-helmet';

// @material-ui/core
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
// core components
import reducer from '../reducer';
import saga from '../saga';
import { makeSelectOne, makeSelectLoading, makeSelectErrors} from '../selectors';
import * as mapDispatchToProps from '../actions';
import PageHeader from '../../../../components/PageHeader/PageHeader';
import PageContent from '../../../../components/PageContent/PageContent';
import BackIcon from '@material-ui/icons/ArrowBack';
import { IconButton } from '@material-ui/core';
import Loading from '../../../../components/Loading';

class AddEdit extends React.PureComponent {
  static propTypes = {
    loadOneRequest: PropTypes.func.isRequired,
    addEditRequest: PropTypes.func.isRequired,
    setOneValue: PropTypes.func.isRequired,
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    classes: PropTypes.object.isRequired,
    one: PropTypes.object.isRequired,
    push: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.props.clearErrors();
    if (this.props.match.params && this.props.match.params.id) {
      this.props.loadOneRequest(this.props.match.params.id);
    }
  }

  handleChange = name => event => {
    event.persist();
    this.props.setOneValue({ key: name, value: event.target.value });
  };

  handleChecked = name => event => {
    event.persist();
    this.props.setOneValue({ key: name, value: event.target.checked });
  };

  handleSave = () => {
    this.props.addEditRequest();
  };

  handleBack = () => {
    this.props.push('/admin/role-manage');
  };

  render() {
    const { classes, one, match, loading, errors} = this.props;
    return loading && loading == true ? (
     <Loading/>
    ) : (
      <React.Fragment>
        <Helmet>
          <title>
            {match && match.params && match.params.id
              ? 'Edit Role'
              : 'Add Role'}
          </title>
        </Helmet>
        <div className="flex justify-between mt-3 mb-3">
        <PageHeader>
        <IconButton className={`${classes.backbtn} cursor-pointer`}	 onClick={this.handleBack} aria-label="Back">
          <BackIcon />
        </IconButton>{match && match.params && match.params.id
            ? 'Edit Role'
            : 'Add Role'}</PageHeader>
        </div>
        <PageContent>
            <div className="w-full md:w-1/2 pb-4">
            <label className="block uppercase tracking-wide text-grey-darker text-xs mb-2">
            Role Title
            </label>
            <input className="Waftinputbox" id="role_title" type="text"  value={one.role_title}
                       onChange={this.handleChange('role_title')} required/>
                       <div id="component-error-text">
              {errors.role_title }
            </div>
          </div>

          <div className="w-full md:w-1/2 pb-4">
            <label className="block uppercase tracking-wide text-grey-darker text-xs mb-2">
            Description
            </label>
            <textarea className="Waftinputbox" id="description" type="text"   value={one.description}
                       onChange={this.handleChange('description')} required/>
                       <div id="component-error-text">
            {errors.description }
          </div>
          </div>
             
              <FormControlLabel
                control={
                  <Checkbox
                    color="primary"
                    name="is_active"
                    checked={one.is_active}
                    onChange={this.handleChecked('is_active')}
                  />
                }
                label="Is Active"
              />
      <br/>
          
              <button className="text-white py-2 px-4 rounded mt-4 btn-waft" onClick={this.handleSave}>
              Save
              </button>
        
        </PageContent>
      </React.Fragment>
    );
  }
}

const withReducer = injectReducer({ key: 'adminRole', reducer });
const withSaga = injectSaga({ key: 'adminRole', saga });

const mapStateToProps = createStructuredSelector({
  one: makeSelectOne(),
  loading: makeSelectLoading(),
  errors: makeSelectErrors(),
});

const withConnect = connect(
  mapStateToProps,
  { ...mapDispatchToProps, push },
);

const styles = theme => ({
  backbtn:{
    padding:0,
    height:'40px',
    width:'40px',
    marginTop:'auto',
    marginBottom:'auto',
    borderRadius:'50%',
    marginRight:'5px',
  }
});

const withStyle = withStyles(styles);

export default compose(
  withReducer,
  withSaga,
  withConnect,
  withStyle,
)(AddEdit);
