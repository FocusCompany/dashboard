import React from 'react';
import BigCalendar from 'react-big-calendar';
import Graph from './Graph';
import 'react-big-calendar/lib/css/react-big-calendar.css';

class Calendar extends Graph {
	render() {
		return (
			<div ref={this.myRef} style={{width: this.state.width, height: this.state.height}}>
				<BigCalendar
					events={this.state.data}
					view='week'
					showMultiDayTimes
					defaultDate={new Date()}
				/>
			</div>
		);
	}
}

export default Calendar;
