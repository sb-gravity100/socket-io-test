import TimeAgo, { FormatStyleName } from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en.json';
import { FC, HTMLProps } from 'react';

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(en);

type TimeAgoProps = {
   formatStyle: FormatStyleName;
   date: Date | number;
};

const timeAgo = new TimeAgo('en');

const ReactTimeAgo: FC<TimeAgoProps & Partial<HTMLProps<HTMLDivElement>>> = ({
   formatStyle,
   date,
   ...props
}) => {
   return <div {...props}>{timeAgo.format(new Date(date), formatStyle)}</div>;
};

export default ReactTimeAgo;
