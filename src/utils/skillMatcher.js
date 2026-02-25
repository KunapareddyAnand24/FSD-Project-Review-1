/**
 * Utility to match student skills with job requirements.
 * 
 * @param {string[]} studentSkills - Array of student's skills
 * @param {string[]} jobRequirements - Array of job's requirements
 * @returns {boolean} - True if at least one skill matches or if job has no requirements
 */
export const hasSkillMatch = (studentSkills = [], jobRequirements = []) => {
    // If job has no requirements, it's open to everyone
    if (!jobRequirements || jobRequirements.length === 0) return true;

    // If student has no skills but job has requirements, no match
    if (!studentSkills || studentSkills.length === 0) return false;

    const normalizedStudentSkills = studentSkills.map(s => s.toLowerCase().trim());

    return jobRequirements.some(req =>
        normalizedStudentSkills.includes(req.toLowerCase().trim())
    );
};
