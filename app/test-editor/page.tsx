"use client"

import { useSession } from "next-auth/react"
import SimpleLiveEditor from "@/components/simple-live-editor"
import DebugSession from "@/components/debug-session"

export default function TestEditorPage() {
  const { data: session, status } = useSession()

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <DebugSession />
      
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Test Live Editor</h1>
        
        <SimpleLiveEditor pageId="test" pageSlug="test">
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow" data-editable>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Section 1</h2>
              <p className="text-gray-700">
                This is a test section that should be editable. Click the "Edit Page" button 
                in the top-right corner, then click on this text to edit it.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow" data-editable>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Section 2</h2>
              <p className="text-gray-700">
                This is another test section. You should be able to edit this content 
                when in edit mode.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow" data-editable>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Test Section 3</h2>
              <p className="text-gray-700">
                This is the third test section. All sections should be editable 
                when you're logged in as an admin user.
              </p>
            </div>
          </div>
        </SimpleLiveEditor>
        
        <div className="mt-8 p-4 bg-blue-100 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Make sure you're logged in as an admin user</li>
            <li>Look for the blue "Edit Page" button in the top-right corner</li>
            <li>Click the "Edit Page" button to enter edit mode</li>
            <li>Click on any of the white sections above to edit them</li>
            <li>Use the save button to save your changes</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
