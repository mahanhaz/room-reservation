import React, { Component } from 'react';
import moment from 'moment';
import TimeTableEntity from './time-table-entity.jsx'

export default class PriceAndAvailibility extends Component {
  constructor(props) {
    super(props);

    const nowMoment = moment();

    this.state = {
      navigator: {
        currentYear: nowMoment.year(),
        currentMonth: nowMoment.month(),
      },
      viewTimelineRange: this.getMonthDateRange(),
      viewTimelineDatas: []
    };
  }

  getMonthDateRange() {
    let currentMoment = moment();

    if (this.state) {
      currentMoment.set({
        'year': this.state.navigator.currentYear,
        'month': this.state.navigator.currentMonth,
      });
    }

    const startDate = currentMoment.date(1);
    const endDate   = moment(startDate).endOf('month');

    return { start: startDate, end: endDate };
  }

  prepareTimeline () {
    let timeline = [];

    let reachedEnd   = false;

    const dayOfMonth = this.state.viewTimelineRange.start;

    while (!reachedEnd) {
      timeline.push({
        dayName: dayOfMonth.format('dddd'),
        dayNumber: dayOfMonth.format('D'),
        singleRoomAvailable: 0,
        singleRoomPrice: 0,
        doubleRoomAvailable: 0,
        doubleRoomPrice: 0,
      });

      if (dayOfMonth.format('MM-DD-YYYY') === this.state.viewTimelineRange.end.format('MM-DD-YYYY')) {
        reachedEnd = true;
      }

      dayOfMonth.add(1, 'day');
    }

    return timeline;
  }

  render() {
    const timeline = this.prepareTimeline();

    return (
      <form className="form-inline form-price-and-availibility">
        <div className="left-panel">
          <div className="row-price-availibility">
            <span>Price and Availability</span>
          </div>
          <div className="row-single-room">
            <span>Single Room</span>
          </div>
          <div className="row-room-available">
            <span>Room Available</span>
          </div>
          <div className="row-price">
            <span>Price</span>
          </div>
          <div className="row-double-room">
            <span>Double Room</span>
          </div>
          <div className="row-room-available">
            <span>Room Available</span>
          </div>
          <div className="row-price">
            <span>Price</span>
          </div>
        </div>
        <div className="right-panel">
          <div className="top-date-picker">
            <span
              className="date-picker-month-navigator
              glyphicon glyphicon-triangle-left"
              onClick={() => {
                this.state.navigator.currentYear--;
                this.state.viewTimelineRange = this.getMonthDateRange();

                this.setState([
                  this.state.navigator,
                  this.state.viewTimelineRange,
                ]);
              }}>
            </span>
            <div className="date-picker-month-navigator-dropdown">
              <select
                onChange={(e) => {
                  this.state.navigator.currentMonth = e.target.value;
                  this.state.viewTimelineRange      = this.getMonthDateRange();

                  this.setState([
                    this.state.navigator,
                    this.state.viewTimelineRange,
                  ]);
                }}
                value={this.state.navigator.currentMonth}>
                selected={this.state.navigator.currentMonth}>
                {
                  [
                    'January',
                    'February',
                    'March',
                    'April',
                    'May',
                    'June',
                    'July',
                    'August',
                    'September',
                    'October',
                    'November',
                    'December',
                  ].map((monthName, i) => {
                    return (<option key={i} value={i}>{monthName}</option>);
                  })
                }
              </select>
              <span className="date-picker-month-navigator
                glyphicon glyphicon-triangle-bottom"></span>
            </div>
            <span>{this.state.navigator.currentYear}</span>
            <span
              className="date-picker-month-navigator
              glyphicon glyphicon-triangle-right"
              onClick={() => {
                this.state.navigator.currentYear++;
                this.state.viewTimelineRange = this.getMonthDateRange();

                this.setState([
                  this.state.navigator,
                  this.state.viewTimelineRange,
                ]);
              }}></span>
          </div>
          <div className="time-table-wrapper">
            <div className="time-table">
              {
                timeline.map((obj, i) => {
                  return (
                    <TimeTableEntity
                      key={i}
                      dayName={obj.dayName}
                      dayNumber={obj.dayNumber}
                      singleRoomAvailable={obj.singleRoomAvailable}
                      singleRoomPrice={obj.singleRoomPrice}
                      doubleRoomAvailable={obj.doubleRoomAvailable}
                      doubleRoomPrice={obj.doubleRoomPrice}
                      />
                  );
                })
              }
            </div>
          </div>
        </div>
        <div className="clearfix"></div>
      </form>
    );
  }
}
