import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';

interface SatisfactionChartProps {
  player: number[];
  target: number[];
  currentRound?: number;
  height?: number;
  showCaption?: boolean;
}

/**
 * The most important UI element of the game — Insight B1 fix applies here:
 *  • Target line: pink-acc, 3px wide, dashed, labelled "TARGET" at endpoint.
 *  • Player line: solid teal, 3px wide, prominent.
 *  • A clear caption above the chart explaining the goal.
 */
export function SatisfactionChart({
  player,
  target,
  currentRound,
  height = 180,
  showCaption = true,
}: SatisfactionChartProps) {
  const data = player.map((value, i) => ({
    round: i,
    player: value,
    target: target[i],
  }));

  return (
    <div>
      {showCaption && (
        <div className="text-[11px] text-gray font-semibold mb-1.5 flex items-center gap-2">
          <span className="inline-block w-3 h-[2px] bg-pink-acc border-t border-dashed" />
          Match the dashed line for the best score
        </div>
      )}
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 38, bottom: 4, left: -18 }}
          >
            <CartesianGrid stroke="#E8F4F2" strokeDasharray="2 4" />
            <XAxis
              dataKey="round"
              tick={{ fontSize: 9, fill: '#5A6A68' }}
              axisLine={{ stroke: '#D6DDE0' }}
              tickLine={false}
              label={{ value: 'Round', position: 'insideBottom', offset: -2, fontSize: 9, fill: '#5A6A68' }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: '#5A6A68' }}
              axisLine={{ stroke: '#D6DDE0' }}
              tickLine={false}
              width={28}
            />
            <Tooltip
              contentStyle={{
                fontSize: 11,
                borderRadius: 8,
                border: '1px solid #D6DDE0',
                padding: '4px 8px',
              }}
              labelFormatter={(v) => `Round ${v}`}
              formatter={(value, name) => [
                Math.round(Number(value)),
                name === 'player' ? 'You' : 'Target',
              ]}
            />
            {currentRound !== undefined && currentRound > 0 && (
              <ReferenceLine x={currentRound} stroke="#028090" strokeWidth={1} strokeDasharray="2 2" />
            )}
            <Line
              type="monotone"
              dataKey="target"
              stroke="#D9A7C7"
              strokeWidth={3}
              strokeDasharray="6 4"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            >
              <Label
                position="right"
                value="TARGET"
                fontSize={9}
                fontWeight={800}
                fill="#D9A7C7"
                offset={6}
              />
            </Line>
            <Line
              type="monotone"
              dataKey="player"
              stroke="#006B5E"
              strokeWidth={3}
              dot={{ r: 3, fill: '#006B5E' }}
              activeDot={{ r: 5 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
