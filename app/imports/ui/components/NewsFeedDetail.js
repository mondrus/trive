/**
* @Author: philip
* @Date:   2017-05-27T23:46:28+00:00
* @Filename: NewsFeedDetail.js
 * @Last modified by:   philip
 * @Last modified time: 2017-05-30T10:29:29+00:00
*/


/* window */
import React, { Component } from 'react';
import { Button, ButtonToolbar, Col, Panel, Row } from 'react-bootstrap';
import Annotator from 'annotator';
import Annotations from '/lib/collections/annotations';
import AnnotationStorage, { UserUtil } from '../../modules/CustomAnnotationStorage';
import annotatorMarginalia from '../../modules/annotator.maginalia';
import AnnotationsList from './AnnotationsList';
import FeedFrame from '../containers/FeedFrame';

const dummyFeed = {
  customProp: "customProp!",
  description: "Travelers with British Airways are facing disruptions Saturday after the airline reported major computer problems.",
  guid: "http://www.cnn.com/2017/05/27/world/british-airways-computer-failure/index.html",
  image: "http://i2.cdn.turner.com/cnnnext/dam/assets/170527134609-06-british-airways-delays-heathrow-0527-super-169.jpg",
  link: "http://www.cnn.com/2017/05/27/world/british-airways-computer-failure/index.html",
  pubDate: 'Sun May 28 2017 04:28:40 GMT+0000 (UTC)',
  title: "All British Airways flights from two main London airports canceled"
};

class NewsFeedDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAnnotations: false,
      annotations: []
    };

    this.app = new Annotator.App();
    this.app.include(UserUtil);
    this.showAnnotations = this.showAnnotations.bind(this);
  }

  showAnnotations() {
    this.setState({ showAnnotations: !this.state.showAnnotations });
  }

  componentWillReceiveProps(nextProps) {
    const { feed, annotationsLoading, annotations } = nextProps;

    if (!annotationsLoading) {
      const ann = Annotations.findOne();
      const annotations = ann ? ann.annotations : [];
      
      this.setState({ annotations });

      this.app.include(AnnotationStorage, {
        story: feed,
        annotations
      });

      this.app.annotations.load(annotations);
    }
  }
  
  render() {
    let { feed, annotationsLoading } = this.props;
    const { showAnnotations, annotations } = this.state;
    
    feed = feed ? feed : dummyFeed;

    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <Row>
          <Col md={12}>
            <Panel>
              <b>{feed.title}</b>
              <ButtonToolbar className="pull-right">
                <Button
                  bsSize="xsmall"
                  bsStyle="primary"
                  disabled={annotationsLoading}
                  onClick={this.showAnnotations}
                >
                  { !annotationsLoading ?
                    `${showAnnotations ? 'Hide' : 'Show'} Annotations (${annotations.length})`
                  : 
                    <span>
                      Loading  <span className="loading dots" />
                    </span>
                  }
                </Button>
              </ButtonToolbar>
            </Panel>
          </Col>
        </Row>
        <div className="row">
          <div className="col-lg-12">
            <Row>
              <Col md={!showAnnotations ? 12 : 9} id="currentFeed">
                <FeedFrame url={feed.link}/>
              </Col>
              {showAnnotations &&
              <Col md={3} >
                <AnnotationsList annotations={annotations}/>
              </Col>}
            </Row>
            <div className="ibox-footer">
              <span className="pull-right">
                <i className="fa fa-clock-o"></i> {`${feed.pubDate}`}
              </span>
              <div className="clearfix" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  componentDidMount() {
    const { feed } = this.props;
    const ann = Annotations.findOne();
    
    this.app.include(Annotator.ui.main, {
      element: document.getElementById('currentFeed')
    });

    this.app.include(AnnotationStorage, {
      story: feed,
      annotations: ann ? ann.annotations : []
    });

    this.app.start()
    .then(() => {
      this.app.annotations.load();
    });
  }
}

export default NewsFeedDetail;


