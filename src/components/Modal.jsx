<Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
  <h2>Success!</h2>
  <p>{success}</p>
  {carbonResult && (
    <p className="result">
      This activity added {carbonResult} kg CO₂ to your footprint.
    </p>
  )}
  {suggestedOffsets.length > 0 && (
    <div>
      <p>Here are some ways to help offset your footprint:</p>
      <ul>
        {suggestedOffsets.map((offset, index) => (
          <li key={index}>{offset}</li>
        ))}
      </ul>
      <p>
        Have a look at our <a href="/volunteer">volunteer</a> page for live opportunities.
      </p>
    </div>
  )}
</Modal>
