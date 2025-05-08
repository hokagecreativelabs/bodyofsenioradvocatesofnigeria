const committees = [
    {
      title: "BOSAN Executive Committee",
      description:
        "The BOSAN Executive Committee is an elective committee created by the BOSAN Constitution. It is charged with the day-to-day administrative responsibility of the Body.",
      members: [
        "The BOSAN General Secretary",
        "Assistant Secretary",
        "Treasurer",
        "Financial Secretary",
        "Publicity Secretary",
      ],
    },
    {
      title: "BOSAN Leadership Committee",
      description:
        "The BOSAN Leadership Committee is a constitutionally recognized committee of the Body charged with the implementation of the utilization of the BOSAN Funds. The Committee is further divided into Sub-Committees in order to actualize its objectives effectively.",
      members: [
        "The BOSAN Ethics Committee",
        "The Continuing Legal Education Sub-Committee",
        "The Scholarship Sub-Committee",
        "The Dinner Sub-Committee",
      ],
    },
    {
      title: "BOSAN Special-Purpose Committee",
      description:
        "The BOSAN Special Purpose Committees are committees set up at the general meetings of BOSAN tasked with specific assignments.",
      members: [
        "Committee on Conflicting Judgement of the Superior Courts",
        "Committee on the Reforms of the Supreme Court",
        "Committee on Bills before the National Assembly",
        "BOSAN Constitutional Review Committee",
      ],
    },
  ];
  
  const Committee = () => {
    return (
      <div className="bg-[#FEFBF6] text-[#3D3C42] px-6 py-10 max-w-5xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-[#7F5283] mb-10">
          BOSAN Committees
        </h1>
  
        {committees.map((section, index) => (
          <div key={index} className="mb-12">
            <h2 className="text-2xl font-semibold text-[#7F5283] mb-2">
              {section.title}
            </h2>
            <p className="mb-4">{section.description}</p>
            <ul className="list-disc list-inside space-y-1">
              {section.members.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  export default Committee;
  