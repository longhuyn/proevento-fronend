import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

export default class ProfileCalendar extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
                events={[
                    { title: 'event 1', date: '2021-04-24'},
                    { title: 'event 2', date: '2021-04-24'}
                ]}
            />
        )
    }
}