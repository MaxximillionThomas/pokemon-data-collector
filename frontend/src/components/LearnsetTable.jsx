
/**
 * Project:       Pokemon Data Collector
 * File:          LearnsetTable.jsx
 * @description   Displays a searchable, clean table of moves and levels learned.
 * @author        Maxximillion Thomas
 * @date          March 4, 2026
 */

/**
 * Renders a collapsible table of moves learned by leveling up.
 * @param {Object} props - The component props.
 * @param {Array<Object>} props.learnset - Array of move objects {move: string, level: number}.
 * @returns {JSX.Element} A formatted table of moves.
 */
export function LearnsetTable({ learnset }) {
    return (
        <table className="table table-striped table-hover">
            {/* Header */}
            <thead>
                <tr>
                    <th>Move Name</th>
                    <th>Level Learned</th>
                </tr>
            </thead>

            {/* Data */}
            <tbody>
                {learnset.map((item, index) => (
                    <tr key={index}>
                        <td className="text-capitalize">{item.move.replace('-', ' ')}</td>
                        <td>{item.level}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}