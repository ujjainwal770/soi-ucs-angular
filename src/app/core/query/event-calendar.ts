import { gql } from 'apollo-angular';

// School admin - get participants for the list page
export const listParticipantsQuery = gql`
query($page:Float!,$limit:Float!,$order_by:String!, $order:String!){
    getSchoolEventActiveUserForAdmin(participantListWithStatusInput:{
    page:$page,
    limit:$limit,
    order_by:$order_by,
    order:$order
  }){
    participant_list{
        user_id,
        full_name,
        first_name,
        last_name,
        email,
        date_of_birth,
        phone,
    },
    count
  }
}`;

//add calendar event
export const addEventQuery = gql`
mutation($title:String!,$description:String!,$start_date_time:Float!,$end_date_time:Float!,$is_select_all_participant:Float,$participant_ids:[Float!]!){
  manageEventCalendar(manageEventCalendarInput:{
    title: $title,
    description: $description,
    start_date_time: $start_date_time,
    end_date_time: $end_date_time,
    is_select_all_participant: $is_select_all_participant,
    participant_ids: $participant_ids,
    
  }){
    id,
    title,
    description,
    start_date_time,
    end_date_time
  }
}`;
//add calendar event
export const editEventQuery = gql`
mutation($id:Float!,$title:String!,$description:String!,$start_date_time:Float!,$end_date_time:Float!,$is_select_all_participant:Float,$participant_ids:[Float!]!){
  manageEventCalendar(manageEventCalendarInput:{
    id:$id,
    title: $title,
    description: $description,
    start_date_time: $start_date_time,
    end_date_time: $end_date_time,
    is_select_all_participant: $is_select_all_participant,
    participant_ids: $participant_ids,
    
  }){
    id,
    title,
    description,
    start_date_time,
    end_date_time
  }
}`;

// School admin - get calendar events for calendar view
export const getCalendarEventsQuery = gql`
query($page:Float!,$limit:Float!,$year:Float!,$month:Float!,$local_time_zone_offset_in_minutes:Float!){
  getCalendarEventViewForAdmin(calendarEventViewInput:{
    page:$page,
    limit:$limit,
    year:$year,
    month:$month,
    local_time_zone_offset_in_minutes: $local_time_zone_offset_in_minutes
  }){
    event_view {
			count,
			day,
			event_list {
				id,
				school_id,
				title,
				description,
				event_date,
				start_date_time,
				end_date_time,
				is_completed,
				user_id,
				participant_event_status
			}
		}
  }
}`;

// School admin - get calendar events for calendar view
export const getCalendarEventsListQuery = gql`
query($page:Float!,$limit:Float!,$school_id:Float!,$local_time_zone_offset_in_minutes:Float!,$order_by:String!, $order:String!){
  getCalendarEventListByEvent(calendarEventListInput:{
    
    page:$page,
    limit:$limit,
    school_id:$school_id
    local_time_zone_offset_in_minutes: $local_time_zone_offset_in_minutes
    order_by:$order_by,
    order:$order,
  }){
			count,
			event_list {
				id,
				school_id,
				title,
				description,
				event_date,
				start_date_time,
				end_date_time,
				is_completed,
				user_id,
				participant_event_status
      }
  }
}`;

// School admin - get calendar events for calendar view
export const getCalendarEventsListOfDayQuery = gql`
query($page:Float!,$limit:Float!,$school_id:Float!,$local_time_zone_offset_in_minutes:Float!,$order_by:String!, $order:String!,$start_date:Float!,$end_date:Float!){
  getCalendarEventListByEvent(calendarEventListInput:{
    page:$page,
    limit:$limit,
    school_id:$school_id
    local_time_zone_offset_in_minutes: $local_time_zone_offset_in_minutes
    order_by:$order_by,
    order:$order,
    start_date:$start_date,
    end_date:$end_date
  }){
			count,
			event_list {
				id,
				school_id,
				title,
				description,
				event_date,
				start_date_time,
				end_date_time,
				is_completed,
				user_id,
				participant_event_status
      }
  }
}`;
// School admin - get participants of the event
export const getParticipantsQuery = gql`
query($page:Float!,$limit:Float!,$event_id:Float!,$participant_event_status:[String!]){
  getSchoolEventActiveUserForAdmin(participantListWithStatusInput:{
    page:$page,
    limit:$limit,
    event_id:$event_id,
    participant_event_status:$participant_event_status ,
  }){

			count,
		participant_list {
			user_id,
			email,
			full_name,
			date_of_birth,
			phone,
			participant_event_status,
			isInvited
		},
		selected_participant_list
  }
}`;

// School admin - get participants of the event
export const getParticipantsListQuery = gql`
query($page:Float!,$limit:Float!,$event_id:Float!,$participant_event_status:[String!],$order_by:String!, $order:String!){
  getSchoolEventActiveUserForAdmin(participantListWithStatusInput:{
    page:$page,
    limit:$limit,
    event_id:$event_id,
    participant_event_status:$participant_event_status ,
    order_by:$order_by,
    order:$order,
  }){

			count,
		participant_list {
			user_id,
			email,
			full_name,
			date_of_birth,
			phone,
			participant_event_status,
			isInvited
		},
		selected_participant_list
  }
}`;


//add calendar event
export const cancelEventQuery = gql`
mutation($event_id:Float!){
  cancelCalendarEventByAdmin(
    event_id: $event_id
  ){
    id
  }
}`;
//get event details
export const getEventDetailQuery = gql`
query($event_id:Float!,$local_time_zone_offset_in_minutes:Float!){
  getEventDetailForAdmin(
    event_id:$event_id,
    local_time_zone_offset_in_minutes:$local_time_zone_offset_in_minutes ,
  ){
    id,
    school_id,
    title,
    description,
    event_date,
    start_date_time,
    end_date_time,
    event_date,
    event_days,
    is_completed,
    user_id,
    participant_event_status,
    is_deleted,
    mark_as_show_deleted_event
  }
}`;


