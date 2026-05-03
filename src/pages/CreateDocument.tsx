/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, memo } from "react";
import {createDocumentApi, getAuditLogApi} from "../services/create_document";
import { useNavigate } from "react-router-dom";


function CreateDocument() {
  const navigate = useNavigate();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [createdBy, setCreatedBy] = useState("");
  const [workflow, setWorkflow] = useState([
    { stepOrder: 1, isParallel: false, approvers: [""] },
  ]);

  const [auditLogs, setAuditLogs] = useState<[]>([]);

  useEffect(() => {
    const getAuditLogs = async () => {
      const res = await getAuditLogApi();
      setAuditLogs(res.data);
    };
    getAuditLogs();
  },[])

  const addStep = () => {
    setWorkflow([
      ...workflow,
      { stepOrder: workflow.length + 1, isParallel: false, approvers: [""] },
    ]);
  };

  const removeStep = (index) => {
    const updated = workflow
      .filter((_, i) => i !== index)
      .map((step, i) => ({ ...step, stepOrder: i + 1 }));
    setWorkflow(updated);
  };

  const addApprover = (stepIndex) => {
    const updated = [...workflow];
    updated[stepIndex].approvers.push("");
    setWorkflow(updated);
  };

  const updateApprover = (stepIndex, approverIndex, value) => {
    const updated = [...workflow];
    updated[stepIndex].approvers[approverIndex] = value;
    setWorkflow(updated);
  };

  const toggleParallel = (stepIndex) => {
    const updated = [...workflow];
    updated[stepIndex].isParallel = !updated[stepIndex].isParallel;
    setWorkflow(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { title, content, createdBy, workflow };

    try {
      console.log('====', payload);
      const res = await createDocumentApi(payload);
      if(res.data){
        navigate('/dashboard', {replace: true})
      }    
      console.log("Document Created!", res);
    } catch (err) {
      console.log(`Error creating document`, err);
    }
  };

  return (
    <>
      <div className="min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-6">Create Document</h2>
      <ul>
        
        {auditLogs.map((el: any) => 
        <li key={el._id}>{el.createdBy}</li>
      )}
      </ul>
        <div className="max-w-4xl shadow-lg rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block font-medium mb-1">Title</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block font-medium mb-1">Content</label>
              <textarea
                rows={4}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            {/* Created By */}
            <div>
              <label className="block font-medium mb-1">Created By</label>
              <input
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={createdBy}
                onChange={(e) => setCreatedBy(e.target.value)}
                required
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Workflow</h3>

              {workflow.map((step, stepIndex) => (
                <div
                  key={stepIndex}
                  className="border rounded-xl p-4 mb-4 bg-gray-50"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold">Step {step.stepOrder}</h4>

                    <button
                      type="button"
                      onClick={() => removeStep(stepIndex)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Parallel Toggle */}
                  <label className="flex items-center gap-2 mb-3">
                    <input
                      type="checkbox"
                      checked={step.isParallel}
                      onChange={() => toggleParallel(stepIndex)}
                    />
                    <span className="text-sm">Parallel Approval</span>
                  </label>

                  {/* Approvers */}
                  <div className="space-y-2">
                    {step.approvers.map((approver, approverIndex) => (
                      <input
                        key={approverIndex}
                        placeholder="Enter email or user ID"
                        className="w-full border rounded-lg px-3 py-2"
                        value={approver}
                        onChange={(e) =>
                          updateApprover(
                            stepIndex,
                            approverIndex,
                            e.target.value,
                          )
                        }
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => addApprover(stepIndex)}
                    className="mt-3 text-blue-500 text-sm"
                  >
                    + Add Approver
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addStep}
                className="text-blue-600 font-medium"
              >
                + Add Step
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Create Document
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default memo(CreateDocument);
