import TimeAgo, { FormatStyleName } from 'javascript-time-ago';
import { FC } from 'react';

type TimeAgoProps = {
   style: FormatStyleName;
   date: Date | string;
};

const timeAgo = new TimeAgo('en-US');

const ReactTimeAgo: FC<TimeAgoProps> = ({ style, date, ...props }) => {
   return <div {...props}>{timeAgo.format(new Date(date), style)}</div>;
};

export default ReactTimeAgo;
