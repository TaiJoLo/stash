using Microsoft.AspNetCore.Mvc;
using Stash.Models;
using Stash.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Stash.Controllers
{
    [Route("api/parentproducts")]
    [ApiController]
    public class ParentProductController : ControllerBase
    {
        private readonly IParentProductRepository _parentProductRepository;

        public ParentProductController(IParentProductRepository parentProductRepository)
        {
            _parentProductRepository = parentProductRepository;
        }

        // GET: api/parentproducts
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ParentProduct>>> GetParentProducts()
        {
            var parentProducts = await _parentProductRepository.GetAllParentProductsAsync();
            return Ok(parentProducts);
        }

        // GET: api/parentproducts/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<ParentProduct>> GetParentProduct(int id)
        {
            var parentProduct = await _parentProductRepository.GetParentProductByIdAsync(id);
            if (parentProduct == null)
            {
                return NotFound();
            }
            return Ok(parentProduct);
        }

        // POST: api/parentproducts
        [HttpPost]
        public async Task<ActionResult<ParentProduct>> PostParentProduct(ParentProduct parentProduct)
        {
            var createdParentProduct = await _parentProductRepository.AddParentProductAsync(parentProduct);
            return CreatedAtAction(nameof(GetParentProduct), new { id = createdParentProduct.Id }, createdParentProduct);
        }

        // PUT: api/parentproducts/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> PutParentProduct(int id, ParentProduct parentProduct)
        {
            if (id != parentProduct.Id)
            {
                return BadRequest();
            }

            await _parentProductRepository.UpdateParentProductAsync(parentProduct);
            return NoContent();
        }

        // DELETE: api/parentproducts/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteParentProduct(int id)
        {
            var parentProduct = await _parentProductRepository.GetParentProductByIdAsync(id);
            if (parentProduct == null)
            {
                return NotFound();
            }

            await _parentProductRepository.DeleteParentProductAsync(id);
            return NoContent();
        }
    }
}
