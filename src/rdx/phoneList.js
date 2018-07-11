import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable';
import promiseFromPapaParse from 'util/promiseFromPapaParse'

import Rx from "rxjs/Rx";


// import { DataFrame as DataFrame } from 'dataframe-js';
// import { getPublicUrl, getHostName, getOrigin } from 'util/url-utils'

// LIBS
import * as R from 'ramda'

// Actions
const DB_NAME = 'PHONE_LIST'

const ActionsNames = ['FETCH', 'FETCHED']

const Actions = ActionsNames.reduce( 
  ( prev, actionName, idx) => ( 
      R.merge( prev, { [actionName]: DB_NAME + '-' + actionName } ) 
  ),
  {} 
)

const phoneListFetch = () => ({
   type: Actions.PHONE_LIST_FETCH, 
   payload: '' 
  });

const phoneListFetched = (dat) => ({
   type: Actions.PHONE_LIST_FETCHED,
   payload: dat 
  });


/*
 * ACTION IDS
 */
const UPDATE_FLAGS = 'UPDATE_FLAGS'

const actionIds = {
  UPDATE_FLAGS
}

/*
 * ACTION CREATORS
 */


/*
 * REDUCERS
 */

const flags = ( state = null, action ) => {
  switch (action.type) {
    case UPDATE_FLAGS:
      return action.flags
    default:
      return state
  }
}

/*
 * EPICS
 */

const SURVEY_DATA_FETCHING = 'SURVEY_DATA_FETCHING';
const SURVEY_DATA_FETCHED = 'SURVEY_DATA_FETCHED';

const surveyDataFetching = () => ({ type: SURVEY_DATA_FETCHING, payload: '' });
const surveyDataFetched = (surveyDat) => ({ type: SURVEY_DATA_FETCHED, payload: surveyDat });

const surveyDataFetchingEpic = action$ =>
  action$.ofType(SURVEY_DATA_FETCHING)
    .mergeMap(action =>
     // Rx.Observable.fromPromise(DataFrame.fromDSV(`${getOrigin()}${dataFile}`, ';', true))
     Rx.Observable.fromPromise( promiseFromPapaParse( dataFile ) )
        .map(response => surveyDataFetched( response ) )
    );

const surveyData = ( state = {}, action) => {
  switch (action.type) {
    case SURVEY_DATA_FETCHING:
      return {
        loading: true,
        loaded: false,
        dat: null,
        error: null,
        db: null
      }
    case SURVEY_DATA_FETCHED:
      return Object.assign({}, state, 
        { 
          loading:false, 
          loaded: true,
          dat: action.payload, 
          error: false,
          db: createDb( action.payload )
        })
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  flags,
 // surveyData
})

const rootEpic = combineEpics(
  surveyDataFetchingEpic
);

const actions = {
  surveyDataFetching,
  surveyDataFetched
}

export { actionIds, actions, rootEpic, rootReducer, flags, surveyData }

