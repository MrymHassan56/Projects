const StatusTimeline = ({
  history,
}) => {
  return (
    <div className="space-y-4">

      {history.map((item) => (
        <div
          key={item._id}
          className="bg-white p-4 rounded-lg shadow border-l-4 border-black"
        >

          <h3 className="font-bold">

            {item.newStatus}

          </h3>

          <p className="text-gray-600">

            {
              item.note
            }

          </p>

          <p className="text-sm text-gray-500 mt-2">

            {new Date(
              item.createdAt
            ).toLocaleString()}

          </p>

        </div>
      ))}

    </div>
  );
};

export default StatusTimeline;